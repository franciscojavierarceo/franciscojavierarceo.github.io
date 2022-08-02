---
title: The Difficulties of Deploying a Machine Learning Model
description: 10 lessons from a decaade of deploying machine learning
date: 2022-07-05
---


<blockquote class="twitter-tweet"><p lang="en" dir="ltr">you know, deploying machine learning models is very, very difficult</p>&mdash; Francisco Javier Arceo (@franciscojarceo) <a href="https://twitter.com/franciscojarceo/status/1544110672660807680?ref_src=twsrc%5Etfw">July 5, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


# Some Professional History

I've been working in applied machine learning for nearly 10 years and it's quite exciting
to have experienced firsthand how much machine learning infrastructure has changed.

I spent the first half of my career as a "modeler" where I focused on building
machine learning and statistical models for a bunch of different use cases. Over
time I found that I migrated more and more to the engineering work to get the model
deployed because I always found this to be a bottleneck in the work I did.

Concretely, I'd build a pretty good model that suggested it would be impactful
(based on expectations of the performance) but I often found it was a rather
extraordinary effort to get it live and interacting with users/customers.

This is quite well cited by the data science / MLOps space today but it was
les obvious back in 2012 and it was very frustrating. The good news is that, for
better or worse, I was rather relentless in getting my models over the finish line.

Which, in many ways, is what led me to the career I have stumbled into today—which
I am very grateful for—as an engineering manager working at the intersection of
machine learning, data, and engineering.

All this to say that I have spent a surprising share of the last decade working on
getting models into live product experiences. Since I have some lessons learned and
some potentially useful opinions, I thought I'd write them down.

# Ten Lessons Learned from a decade of Deploying ML

## 0. Create strict contracts with the input source of your features

## 1. Test your feature engineering more than you want to

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
