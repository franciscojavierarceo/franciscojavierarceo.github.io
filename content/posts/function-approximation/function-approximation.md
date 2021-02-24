---
title: 'Function Approximation using Data Science Techniques'
description: A Data Scientist's guide to Function Approximation
date: 2021-02-21
---

I've written about the wonders of [Linear Regression](https://franciscojavierarceo.github.io/post/ordinary-least-squares) before and one of the things I find most amazing about it is that it allows you to approximate a function.

But what does that mean?

In short, take data about two things and estimate a relationship between them.

A classic example is Age and Income. Suppose you wanted to understand how a person's age *correlates* to their income. You could take a sample of data and store it in a table, spreadsheet, or even a fancy database somewhere so you could analyze it.

You could then draw a scatter plot (like below) and *visualize* the relationship between the two attributes and fit (i.e., estimate) the relationship (i.e., the slope of that line). If the relationship was strictly **linear**, we'd see a scatter plot that looks something like the graph below.

![A scatter plot!](scatterplot.png)
<p align="center" style="padding:0"><i>A Scatter Plot of Age and Income with a Linear Relationship</i></p>

But what if it wasn't linear?

What if we knew Age only increased Income to a degree and that the marginal return was decreasing? Well, maybe we'd see a plot like below.

![A scatter plot!](income_age_squared.jpeg)
<p align="center" style="padding:0"><i>A Scatter Plot of Age and Income with a Quadratic Relationship</i></p>

What if things were a little less intuitive and, after another point, your Income (on average) started to go back up again? We'd see the graph below.

![A scatter plot!](income_age_cubic.jpeg)
<p align="center" style="padding:0"><i>A Scatter Plot of Age and Income with a Cubic Relationship</i></p>

Lastly, what if we saw something that was just plain *weird*?

![A scatter plot!](income_age_weird.jpeg)
<p align="center" style="padding:0"><i>A Scatter Plot of Age and Income with </i></p>

This is my favorite example because it shows a [piece-wise linear function](https://en.wikipedia.org/wiki/Piecewise_linear_function) and while strange looking, they're very common phenomena in the wild.

## Why?

Because often times we are modeling behaviors or decisions by other systems in the world, and those systems, decisions, and behaviors often have weird boundary points/thresholds. In the credit world, you'll often see this because a lender's credit policy systematically rejects applications with a certain set of criteria, which would lead to visuals identical to this.

## How do we approximate weird functions?

The fun part! When you have a bivariate relationship like this you don't want to have to tediously [engineer features](https://en.wikipedia.org/wiki/Feature_engineering) to estimate the underlying function. Rather, you'd prefer to have a machine learn the function using [supervised learning](https://en.wikipedia.org/wiki/Supervised_learning).
