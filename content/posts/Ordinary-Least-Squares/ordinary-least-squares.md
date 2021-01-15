---
title: 'The History of Ordinary Least Squares'
description: A brief history of the most important equation in all of statistics.
date: 2021-01-14
---

One of my favorite authors and historical statisticians [Dr. Stephen Stigler](https://stat.uchicago.edu/people/profile/stephen-m.-stigler/) published a wonderful historical review in 1981 titled [*Gauss and the Invention of Least Squares*](https://projecteuclid.org/download/pdf_1/euclid.aos/1176345451). He argued that the prolific [Carl Freidrich Gauss](https://en.wikipedia.org/wiki/Carl_Friedrich_Gauss) discovered [Ordinary Least Squares](https://en.wikipedia.org/wiki/Least_squares) (OLS) in 1809 and fundamentally shaped the future of science, business, and society as we know it.

So, what is OLS and why is it so important?

OLS is often referred to by many things across several different discipilines, some of them are:

- Linear Regression
- Multivariate Regression
- The Normal Equations
- Maximum Likelihood
- Method of Moments
- Singular Value Decomposition of $X\bf{w}-\bf{y}=U(\Sigma^T\bf{w}-U^{T}-\bf{y})$

But all of them ultimately reflect the same mathematical expression (in scalar notation):

$y_i = \beta_0 + \sum_{j=1}^{k} \beta_i x_i + \epsilon_i $

Which yields the famous estimator (i.e., equation) for $\hat{\beta_j}$ as

$\hat{\beta_j} = \sum_{i=1}^{n} (x_i - y_i)^2 / \sum_{i=1}^n (x_i - \bar{x})^2$

Or in matrix notation:

$\bf \hat{\beta} = \bf (X'X)^{-1} X'Y$.

I find this simple equation to be so extraordinary because of what can be learned from it.

This single equation is used to estimate models for pharmaceuticals, businesses, movie recommendations, and even decisions about public health. I am constantly amazed at how one little equation could accomplish so much.

To think Gauss had discovered OLS as a method of calculating the orbits of celestial bodies and that today, over 200 years later, humans would use it to for so much of what we do is astounding.

Over the years statisticians, economists, computer scientists, engineers, and psychometricians have advanced OLS in such profound and unique ways. Some of them have been used to reflect data generated from more non-standard distributions (e.g., a [Weibull distribution](https://en.wikipedia.org/wiki/Weibull_distribution)), or to frame the problem to use prior information in a structured way (e.g., through [Bayesian Inference](https://en.wikipedia.org/wiki/Bayesian_inference)), while others have enhanced these equations to learn high-dimensional non-linear relationships (e.g., via (Artificial Neural Networks)[https://en.wikipedia.org/wiki/Artificial_neural_network]). Again, all of these are extended from the extraordinary work of Gauss.

There's so much that can be written about all of the advancements that have been made in all of these fields and a short blog post simply won't do it justice, but I thought I'd at least share some thoughts about it. Somewhere along the way today I came across something related to important equations and it led me to write this, so I hope you enjoyed it. 

I'm such a fan of the history of statistics and mathematics that this piece, while not as structured as I'd like, was very enjoyable to write.

Happy computing!

-Francisco