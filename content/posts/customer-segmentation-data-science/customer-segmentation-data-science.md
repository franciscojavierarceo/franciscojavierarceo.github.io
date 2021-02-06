---
title: 'Customer Segmentation using Data Science'
description: A Data Scientists Guide to Segmenting your Customers using clustering algorithms and decision trees.
date: 2021-02-06
---

*TL;DR: A Data Science Tutorial and using K-Means and Decision Trees together.*

Customer segmentation (sometimes called [Market Segmentation](https://en.wikipedia.org/wiki/Market_segmentation)) is ubiqutous in the private sector. We think about bucketing people into $k$ mutually exclusive and collectively exhausting (MECE) groups. The premise being that instead of having 1 strategy for delivering a product or experience, providing $k$ experiences or strategies will yield much better engagement or acquisition from our customers.

Generally speaking, this makes sense; it's intuitive. Provide people a more curated experience and they will enjoy it more...and the more personalized the better. 

Netflix, Spotify, YouTube, Twiter, Instagram, and all of the big tech companies have mastered personalization by using robust, computationally expensive, and sophisticated machine learning pipelines. But the world has been doing this for a long time, just a much less sophisticated version.

So I thought I'd give a technical demo of what customer segmentation looks like in a basic way using a trick I've used for years.

Here are the things I'd like to cover during this demo:

1. What options do I have to segment my customers?
2. How do I actually do the segmentation?
3. What can I do with my new customer segments?
4. How do I know that my segments are effective?
5. How do I know when my segments have changed?

## Approaches to Customer Segmentation

The phrase "Customer Segments" tends to mean different things across different industries, organizations, and even across business functions. As an example, for a consumer products retailer, they may refer to customer segments using both demographic information or their purchase behavior, where a lender may refer to their segments based on credit score bands. While very meaningfully different from a business perspective, the same algorithms can be used for both problems.

From an analytical perspective, I've seen Customer Segments defined really in two main ways:

### 1. Logical Business Segments

These segments tend to be defined by heuristics and things that make common sense. Here's a list of examples:

- Customers who have spent at least $\$X$ (retail) or purchased at least $Y$ number of products
- Customers who have visited your app or website and customers who haven't
- 

### 2. Algorithmic Segments


https://towardsdatascience.com/customer-segmentation-using-k-means-clustering-d33964f238c3