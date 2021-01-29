---
title: 'How to build a credit risk model'
description: A data scientists guide to building a basic credit risk model
date: 2021-01-27
---


*TL;DR: A Data Science Tutorial on building a Credit Risk model*

I previously [wrote](/post/data-science-and-fintech) about some of the work data scientists do in the fintech space, which briefly discussed [credit risk models](https://en.wikipedia.org/wiki/Credit_risk) but I wanted to write a more technical review and talk about what I think are the most important points.

I spent most of my career at banks as a data scientist and built credit risk models in the consumer and commercial space in the US, Australia, and South Africa. I learned a lot from those experiences, so I thought I'd share a simple example of how one of the core pieces of algorithmic/quantitative underwriting is done.

In this post, I'll try to answer the following questions:

- What is a credit risk model?
- What **data** does a credit risk model use?
- How do you estimate a credit risk model?
- How do you know if your model is performing well?
- What are some common mistakes to avoid?
- What are useful facts to know about credit risk models?

## What is a Credit Risk Model?

In the consumer/retail space, a credit risk model tries to predict the probability that a consumer won't repay money that they've borrowed.
A simple example of this is an [unsecured personal loan](https://www.investopedia.com/terms/u/unsecuredloan.asp). 
Let's suppose you submitted an application to borrow $5,000 from a lender. That lender would want to know the likelihood of [default](https://www.investopedia.com/terms/d/default2.asp) before deciding on (1) whether to give you the loan and (2) the price they want to charge you to for borrowing the money. So that probability is probably quite important...but how do they come up with it?

## Data

Lenders typically use data from the major [Credit Bureaus](https://www.investopedia.com/personal-finance/top-three-credit-bureaus/) that is [FCRA](https://www.ftc.gov/enforcement/statutes/fair-credit-reporting-act) compliant, which basically means that the legal and reputational risk of using this data is very low.

Typically, you'd purchase a dataset from one of the bureaus (or use their analytical sandboxes) and process a dataset that looks like the following:

<table>
  <tr>
    <th>Default</th>
    <th>Inquiries in Last 6 Months</th>
    <th>Credit Utilization</th>
    <th>Average Age of Credit</th>
    <th>...</th>
  </tr>
  <tr>
    <td>Yes</td>
    <td>2</td>
    <td>0.8</td>
    <td>12</td>
    <td>...</td>
  </tr>
  <tr>
    <td>No</td>
    <td>8</td>
    <td>0.0</td>
    <td>2</td>
    <td>...</td>
  </tr>
  <tr>
    <td>...</td>
    <td>...</td>
    <td>...</td>
    <td>...</td>
    <td>...</td>
  </tr>
</table>

And so on.

In summary, it's just a bunch of data about your borrowing history.
It's a little recursive/cyclical because in order to grow your credit you need to have credit but let's ignore that detail.

One of the most important steps in the model development process is defining default because this will eventually reflect the performance of your portfolio, so defining it rigorously, accurately, and confidently is extremely consequential.

So how do you define it? 



## Estimating the Probability of Default

## Evaluating your Default Model
- AUC and GINI

## Common Mistakes and Pitfalls
- Simpson's Paradox

## Other Important pieces
- Panel Data and the Discrete-Time Hazard Model
- Generating Adverse Actions codes has a variety of different approaches
- Does a more complicated model impact my target population?

## Conclusion
