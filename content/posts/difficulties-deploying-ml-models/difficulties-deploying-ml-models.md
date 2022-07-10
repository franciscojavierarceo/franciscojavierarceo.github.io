---
title: The Difficulties of Deploying a Machine Learning Model
description: Sharing some of my goals for 2021
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
unknown to me back in 2012 and was very frustrating. The good news is that, for
better or worse, I was rather relentless in getting my models over the finish line.

Which, in many ways, is what led me to the career I have stumbled into today—which
I am very grateful for—as an engineering manager working at the intersection of
machine learning, data, and engineering.

All this to say that I have spent a surprising share of the last decade working on
getting models into live product experiences. I have some lessons learned and
some opinions, so I thought I'd share them.

# Ten Lessons Learned form a decade of Deploying ML

## 0. Separate your model from your features

## 1. Create a container for you service

## 2. Source Your Data

## 3. Validate Your Feature Engineering

## 4. Codify the range of your features

## 5. Abstract your service logic appropriately

## 5. Precompute what you can

## 6. Load your model at service build time

## 7. Right size your server

## 8. Ensure your prediction is efficient

## 9. Monitor your model and features
