---
title: The Difficulties of Machine Learning in Production
description: 10 lessons from a decade of deploying machine learning
date: 2022-08-05
---


<blockquote class="twitter-tweet"><p lang="en" dir="ltr">you know, deploying machine learning models is very, very difficult</p>&mdash; Francisco Javier Arceo (@franciscojarceo) <a href="https://twitter.com/franciscojarceo/status/1544110672660807680?ref_src=twsrc%5Etfw">July 5, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


# Some History

I've been working in the application of machine learning for nearly 10 years
and it's quite exciting to have experienced firsthand how much machine learning
infrastructure has changed in that time.

I spent the first half of my career as a "modeler" where I focused on building
machine learning and statistical models for a bunch of different use cases. Over
time I found that I migrated more and more to the engineering work to get the model
deployed because I always found this to be a bottleneck in the work I did.

Concretely, I'd build a pretty good model that suggested it would be impactful
(based on expectations of the performance) but I often found it was a rather
extraordinary effort to get it live and interacting with users/customers.

This is quite well cited by the data science / MLOps community today but it was
less obvious back in 2012 and it was very frustrating. The good news is that, for
better or worse, I was rather relentless in getting my models over the finish line.

Which, in many ways, is what led me to the career I have stumbled into today as
an engineering manager working at the intersection of machine learning, data,
and engineering.

All this to say that I have spent a surprising share of the last decade working
on getting models into live product experiences. Since I have some lessons
learned and some potentially useful opinions, I thought I'd write them down.

# Ten Lessons from a decade of Deploying ML

## 0: Create strict contracts with the input source of your features

This is the single most important and most frequently omitted step in the
machine learning pipeline. I say this because making unit tests for schemas is
mostly tedious work but, in my experience, this is 90% of the errors
that come up in production. Whether it be a missing field, new field, or a
change to the type of the field, it just seems to happen to *everyone* at some
point.

Whether your model is batch/offline or real-time/online having data/schema validations
is critical as often ML models are dependent upon data from a wide variety of
different upstream sources where the data producer has no knowledge about the
usage of the data, so a trivial change on their end could make cause a world of
chaos for you and the consumers of your models.

Some limitations with this approach are (1) that you may not always know the
top-level producer of your data so making a test may not be so trivial if you
rely on an intermediate data consumer to provide you the data or if you rely on
a vendor that changes something without your notice (this happens more often
than you think). Regardless of the limitations having some tests here
will certainly provide you more coverage and ensure higher quality.

## 1: Test your feature engineering more than you want to

Feature engineering is code.

When software engineers write code for microservices we write lots of unit
tests to capture schema changes, validate edge cases, and make the code
more readable.

Unfortunately, these software design concepts don't always translate to
machine learning applications. This isn't always the case but often this happens
because the skills needed to build good machine learning models are rarely
the same as the skills needed to write good software.

So the recommendation is simple: write lots of unit tests covering all of
the edge cases that come up during feature engineering.

What are some of the edge cases?

- Return type changed
- division by zero
- incorrect logic
- incorrect imputation
- incomplete if-else
- and others

In many ways this is laborious but it makes sense because the bulk of the work
(and code) in machine learning for tabular data is in the feature engineering
and the pipelines supporting those features, so that is where the bulk of the
testing should be.

## 2: Codify the range and scale of your features

Scale and range checking in practice can be rather challenging as sometimes
it's very hard to know what the upper or lower bound will be but often you can
apply sensible heuristics. For example, you can test that features that are
calculated as ratios or rates to between [0,1] and test large but sensible
extremum values for other features.

## 3: Separate your model execution from your feature engineering

Post-estimation a model is a rather trivial function call applied to a matrix
or tensor for most algorithms. The pipeline is usually as simple as:

```
# lots of stuff above
features = build_features()
predictions = model.fit(features=features)
# lots of stuff  below
```

But there are challenges that come up with the `model.fit()`. Specifically,
some models can be very large in size, especially ones using neural networks.
If you do have a large model you have to make sure you think about: right-sizing
the server that will hold the model in memory, where that model will be stored,
how the server will load the model, and what fail-over looks like.

These hardware and software considerations can get complicated on their own,
which is why it's worth not mixing up the model execution with the feature
engineering pipelines or other stuff if you don't have to.

## 4: Separate matrix serialization from model execution

This is another small step in practice but is very consequential as errors come
up and identifying the root cause can often be hairy. So I recommend that you
separate the matrix serialization from your model execution and feature
engineering because it is cleaner and you'll be able to triage inevitable
breaks sooner.

Two specific issues that come up are (1) passing a character to a matrix and (2)
passing a missing value (e.g., `np.nan`). (1) is not a number and in order for
the algorithms to do their fancy stuff they need explicit numbers and (2)
is effectively equivalent but some matrix implementations in python will allow
you to hold a placeholder for a missing value and may even behave with some
basic operations but will ultimately fail at the `model.fit()` step.

Here are two trivial examples that show this problem in action:
```python
# Just showing that this works as normal
xs = np.matrix([[1,2],[3,4]])
print(xs * 1.3)
#matrix([[1.3, 2.6],
#        [3.9, 5.2]])

# Example 1: Now let's try that character
xs = np.matrix([[1,2],[3,'c']])
print(xs * 1.3)
# ...it breaks! and eventually you see this confusing error:
# numpy.core._exceptions.UFuncTypeError: ufunc 'multiply' did not contain a loop with signature matching types (dtype('<U21'), dtype('<U3')) -> None

# Example 2: Now how about that np.nan?
xs = np.matrix([[np.nan, np.nan],[np.nan, np.nan]])
print(xs * 1.3)
# Wild that this works
matrix([[nan, nan],
        [nan, nan]])
```

Trivial in code, chaotic when it blows up a server.

## 5: Avoid mixing business logic with statistical operations

Machine learning systems, even those as simple as what is effectively a
glorified calculator can be surprisingly complicated so I generally recommend
keeping any business logic away from the machine learning or feature engineering
work. It's simply because both business logic and ml code tend to grow
complicated for all sorts of valid reasons but the skills used to debug or
even read and understand either are quite different, so the separation tends to
help with that.

## 6: Precompute what you can

I could write an entire book about feature engineering and the complexity that
it holds but the TL;DR version is that features tend to have all sorts of
different time representations (some feature representing real-time, others
data from yesterday, and others from 3 seconds ago) and this temporal component
ends up creating a lot of engineering complexity.

A general recommendation: precompute and run in batch as much as you possibly
can. You can actually get quite far for many use cases this way without having
to build the complexity that comes with real-time and streaming use cases.

Once you do get to real-time and streaming use cases, there's a whole other
bunch of work to do and I won't cover that here.

## 7: Load your model at service build time

In an ideal world your model is an isolated service or an isolated endpoint with
it's own memory (maybe on kubernetes, maybe not) and you simply load it at build
time. It's pretty simple but this all means you could store your model artifact
in either some [model registry](https://www.mlflow.org/docs/latest/model-registry.html)
or in an S3 buckets.

If you're early in your model building it's absolutely fine to store the model
in GitHub if it's not terribly huge but generally it's preferred to put it in
some other storage meant for larger file sizes.

## 8: Right size your server

Going back again to the challenges that come up when having a large model, you
may not just be encountering issues there. You may also find that some of the
data that you have to process in real-time can get bulky (e.g., if you're
dynamically calculating features based on user history and look back through a
year's worth of data for a bunch of different things).

So it's important to not only right size your server for the model that you will
be using but also for the features that you will be calculating in real-time.
This is usually fairly manageable and if you precompute a lot of features then
you're only doing a lookup and you'll likely have much less memory pressure but
it is worth validating this before deploying your model.

## 9: Monitor your model and features

While this is the last item, it's an extremely important one. A general truth
about models is that if you're launching one it's going to be impactful to some
process or customer experience (woo hoo!) but that means that people make
tradeoffs to get things shipped and monitoring tends to be one of them.

I've typically seen folks leave the monitoring of the model performance as some
afterthought or follow up work to be completed later and usually it does and
it's okay but it really should be top of mind. From a statistical standpoint
this is purely offensive as all sorts of chaotic things can go wrong
when you go from some historical data to a live machine.

It could turn out that your data wasn't from a representative sample, your model
was trained on the wrong metric, you're adversely impacting business metrics
(though this tends to be caught quickly), you have a bug in your code, or that
your model just doesn't work.

You can track most of that from monitoring, so don't omit it.

Most importantly, every applied machine learning model that I've built in
industry has degraded (eventually). It's mostly because things change over time
and that obviously makes sense. Without proper monitoring you will not be able
to observe this phenomena so please don't forget this core component as it could
be very consequential to your business.

It's worth mentioning that model degradation not driven by engineering problems
ends up being a lot of statistical work to understand what is driving the
decay of models. Suffice it to say that it's a complex, high-dimensional
problem.


# Some final thoughts

Reflecting on the list above, I can't help but call out that 9 of these 10 items
are purely focused on the engineering around deploying a model and that the
monitoring is the **last** step.

*As a brief aside, there is a significant amount of pre-work done here to build
these models during the model development lifecycle but I didn't discuss that
here as that's outside the scope of this blog post.*

You don't *actually* have to do anything on that list to get a model in production,
I just recommend it. At an early stage of your service it may not even make sense
to build a bullet-proof system but at a bigger scale these things actually do become
increasingly more important as preventative and defensive measures.

Lastly, I ranked these in order of importance and the most important ones are
all *preventative change controls*, i.e., they can all detect breaks before you
deploy something to production (i.e. in unit tests). Defensive change controls
are great too but one should remember that these will always come second place
to preventative controls simply because you're catching a mistake after it's in
production.


*Have any feedback on this post? Let me know on the [twitter](https://twitter.com/franciscojarceo)!*
