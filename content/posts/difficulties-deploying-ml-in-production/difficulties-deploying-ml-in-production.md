---
title: The Difficulties of Machine Learning in Production
description: 10 lessons from a decade of deploying machine learning
date: 2022-07-05
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
les obvious back in 2012 and it was very frustrating. The good news is that, for
better or worse, I was rather relentless in getting my models over the finish line.

Which, in many ways, is what led me to the career I have stumbled into today as
an engineering manager working at the intersection of machine learning, data,
and engineering.

All this to say that I have spent a surprising share of the last decade working
on getting models into live product experiences. Since I have some lessons
learned and some potentially useful opinions, I thought I'd write them down.

# Ten Lessons from a decade of Deploying ML

## 0. Create strict contracts with the input source of your features

This is the single most important and most frequently omitted step in the
machine learning pipeline. I say this because it's mostly tedious work checking
making unit tests for schemas but, in my experience, this is 90% of the errors
that come up in production. Whether it be a missing field, new field, or a change
to the type of the field, it just seems to happen to *everyone*.

Whether your model is batch/offline or real-time/online having data/schema validations
is critical as often ML models are dependent upon data from a wide variety of
different upstream sources where the data producer has no knowledge about the
usage of the data, so a trivial change on their end make cause a world of chaos
for you and the consumers of your models.

Some limitations with this approach are (1) that you may not always know the
top-level producer of your data so making a test may not be so trivial if you
rely on an intermediate data consumer to provide you the data or if you rely on
a vendor that changes something without your notice (this happens more often
than you think). Regardless of the limitations though having some tests here
will certainly provide you more coverage and ensure higher quality.

## 1. Test your feature engineering more than you want to

Feature engineering is code.

When software engineers write code for microservices we write lots of unit 
tests to capture schema changes, validate edge cases, and make the code 
more readable. 

Unfortunately, these software design concepts don't always translate to 
machine learning applications. This isn't always the case but often this happens
because the skills needed to build good machine learning models is rarely
the same as the skills needed to write good software. 

So the recommendation is simple: write lots of unit tests covering all of
the edge ases that 
## 2. Codify the range and scale of your features

## 3. Separate your model execution from your feature engineering

## 4. Separate matrix serialization from model execution

## 5. Avoid mixing business logic with statistical operations

## 6. Precompute what you can

## 7. Load your model at service build time

## 8. Right size your server

## 9. Monitor your model and features

Reflecting on the list above, it's worth emphasizing that 9 of these 10 items are
purely focused on the engineering around deploying a model. More importantly,
the monitoring is the last step.

*As a brief aside, there is a significant amount of pre-work done here to build
these models and during the model development lifecycle but I won't discuss that here
as that's outside the scope of this blog post.*

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
