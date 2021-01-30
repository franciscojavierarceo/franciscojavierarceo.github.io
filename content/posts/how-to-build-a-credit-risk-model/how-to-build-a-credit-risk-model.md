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

## What Data does a Credit Risk model use?

Lenders typically use data from the major [Credit Bureaus](https://www.investopedia.com/personal-finance/top-three-credit-bureaus/) that is [FCRA](https://www.ftc.gov/enforcement/statutes/fair-credit-reporting-act) compliant, which basically means that the legal and reputational risk of using this data is very low.

Typically, you'd purchase a dataset from one of the bureaus (or use data inside one of their analytical sandboxes) and clean the dataset into something that looks like the following:

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

One of the most important steps in the model development process is *precisely* defining **default** because this will eventually reflect the performance of your portfolio, so defining it rigorously, accurately, and confidently is extremely consequential.

So how do you define it?

Time. 

If you're planning to launch a term loan, you usually set boundaries on the duration of the loan.
Let's say you want to launch a 12 month loan to an underserved market, then you'd want to get historical data of other lenders to build your model on.
It sounds a little surprising that you can do this but that's basically how the bureaus make their money.

An important thing to keep in mind is that you need to make sure you pull the data at 2 different time periods: (1) when the original application was made so you can use data that is relevant for underwriting (and so you don't have forward-looking data resulting in [data leakage](https://www.kaggle.com/dansbecker/data-leakage)) and (2) 12 months later (or whatever time period is appopriate for you) to check if the consumer defaulted on their loan.

There's a lot more to it and you can expand on things in much more elegant ways to handle different phenomena but for the sake of simplicity, this is essentially how it's done.

So, after painfully cleaning up all that data, what do you do with it?

## Building a Probability of Default Model

Now that you have that glorious dataset you can start to run different [Logistic Regressions](https://en.wikipedia.org/wiki/Logistic_regression) or use other classification based machine learning algorithms to find hidden patterns and relationships (i.e., [non-linear functions](https://blog.minitab.com/blog/adventures-in-statistics-2/what-is-the-difference-between-linear-and-nonlinear-equations-in-regression-analysis#:~:text=If%20the%20equation%20doesn't,a%20linear%20equation%2C%20it's%20nonlinear.&text=Thetas%20represent%20the%20parameters%20and,one%20parameter%20per%20predictor%20variable.) and [interaction terms](https://en.wikipedia.org/wiki/Interaction_(statistics))).
Personally, this is the most intellectually engaging part of the work. The other work involved in credit risk modeling is usually very stressful and filled with less exciting graphs but here you get to pause, look at data, and, for a moment, try to make a crude approximation of the world. I find this part *fascinating*.

If we stick with our simple model above, we could use our good old friend Python to run a simple regression.

```python
import numpy as np
import statsmodels.api as sm

n = 10000
np.random.seed(0)
x_1 = np.random.poisson(lam=5, size=n)
x_2 = np.random.poisson(lam=2, size=n)
x_3 = np.random.poisson(lam=12, size=n)
e = np.random.normal(size=n, loc=0, scale=1.)

b_1, b_2, b_3 = -0.005, -0.03, -0.15
ylogpred =  x_1 * b_1 + x_2 * b_2 + x_3 * b_3 + e
yprob = 1./ (1.+ np.exp(-ylogpred))
yclass = np.where(yprob >= 0.5, 1, 0)
xs = np.hstack([
    x_1.reshape(n, 1), 
    x_2.reshape(n, 1), 
    x_3.reshape(n, 1)
])
xs = sm.add_constant(xs)
model = sm.Logit(yclass, xs)
res = model.fit()
print(res.summary())
         Current function value: 0.163863
         Iterations 8
                           Logit Regression Results                           
==============================================================================
Dep. Variable:                      y   No. Observations:                10000
Model:                          Logit   Df Residuals:                     9996
Method:                           MLE   Df Model:                            3
Date:                Fri, 29 Jan 2021   Pseudo R-squ.:                  0.1056
Time:                        00:08:17   Log-Likelihood:                -1638.6
converged:                       True   LL-Null:                       -1832.2
Covariance Type:            nonrobust   LLR p-value:                 1.419e-83
==============================================================================
                 coef    std err          z      P>|z|      [0.025      0.975]
------------------------------------------------------------------------------
const          0.4535      0.209      2.166      0.030       0.043       0.864
x1            -0.0439      0.023     -1.949      0.051      -0.088       0.000
x2            -0.0390      0.035     -1.109      0.267      -0.108       0.030
x3            -0.3065      0.017    -18.045      0.000      -0.340      -0.273
==============================================================================
```

Wow, look at all of that beautiful, useless statistical output! It's not really useless but 99% of the people involved will not find it useful. 
So we probably need an alternative way to show and inform these results to non-technical stakeholders (but your data scientist can look at this as much as they'd like).

![The Glorious Lift Chart!](liftchart.png)
<p align="center" style="padding:0"><i>The Beloved Lift Chart</i></p>

Cue the [Lift Chart](https://www.casact.org/education/rpm/2016/presentations/PM-LM-4.pdf). This Chart may look fancy but it's actually pretty simple, it's just [deciling](https://www.investopedia.com/terms/d/decile.asp) (i.e., sorting and bucketing into 10 equal groups) your data according to the *predicted* default rate from your model. It's worth noting that this is a quantized version of the [ROC chart](https://en.wikipedia.org/wiki/Receiver_operating_characteristic) and they represent the same information.

## Evaluating your Default Model

So this visualization is helpful, but what about quantifying the performance in a single number? Well, how about [Accuracy](https://en.wikipedia.org/wiki/Accuracy_and_precision)?

Well it turns out that Accuracy isn't a really great metric when you have a low rate (or more generally when you have severe [class-imbalance](https://en.wikipedia.org/wiki/Accuracy_paradox)). As an example suppose you have a 5% default rate, that means 95% of your data did not default, so if your model predicted that no one defaulted, you'd have 95% accuracy. Pretty useles, so we tend to ignore the accuracy and instead focus on the rank order seperation/predictive power of the model. There are 3 main metrics folks look at to summarize their model: [Precision, Recall](https://en.wikipedia.org/wiki/Precision_and_recall), and [Gini/AUC](https://en.wikipedia.org/wiki/Receiver_operating_characteristic#Area_under_the_curve). One last point that has been a surprisingly common topic of my discussion in my career is the equivalence of Gini and AUC. Bankers like Gini, for whatever inertia related reason, but it's equivalent to AUC via:

$$Gini = 2 * AUC - 1$$ and

$$AUC = (Gini+1)/2$$.

Gini is between -1 and 1 and AUC is between 0 and 1 (but < 0.5 means you're doing worse than random so generally it's between 0.5 and 1). So, a good model is usually around 0.7 AUC or 0.4 Gini. The higher the better. It's always worth looking at your lift chart though as it can tell you a lot about how predictive the model is at different deciles. In some cases, your model may not have enough variation in the attributes/features/predictors to differentiate your data meaningfully. The metric won't show you that, only a glance at the Lift Chart will, so it's always a nice thing to look at.

So now that yuo have your exciting new default model, you can use it in your underwriting strategy to differentiate amongst your competitors on pricing, approve/decline, and targeting customers, right?

Not quite.

## Common Mistakes and Pitfalls
Before you get too excited about your model, you want to verify that it's behaving logically, so I thought I'd list some items that you will want to check against to make sure nothing disastrous will happen. 

- [Data Errors](https://www.datasciencecentral.com/profiles/blogs/common-errors-in-machine-learning-due-to-poor-statistics-knowledg)
- Time Traveling (No external resource but this is basically making sure you don't use data that's in the future  of it's representation--excluding the default metric)
- [Simpson's Paradox](https://en.wikipedia.org/wiki/Simpson%27s_paradox)
- Double check for [Data Leakage](https://www.kaggle.com/dansbecker/data-leakage)
- Validating your model with an [Out of Time](https://statmodeling.stat.columbia.edu/2016/11/22/30560/) Hold Out Sample
- Validating your model actually has a [representative sample](https://www.investopedia.com/terms/r/representative-sample.asp#:~:text=A%20representative%20sample%20is%20a,three%20males%20and%20three%20females.) of your future portfolio

I could have written an extraordinary amount of information both from a statistical and business lens, but for the sake of brevity, I wrote the most pressing ones and I invite you to search for more information about other complications. I've really trivialized the work here for the sake of intuition and simplicity.

## Some other Interesting Extensions

The model I showed above is quite literally the most basic example and the models that most lenders and vendors use are much more sophisticated. Many of them have enhanced their models to handle panel data (i.e., cohorts of people over time) and can constrcut models that are extremely robust. The best class of models in this category (in my personal opinion) are [Discrete Time Survival Models](https://bookdown.org/content/4253/fitting-basic-discrete-time-hazard-models.html). This isn't my opinon, interestingly this wisdom was shared with me from 2 of the former heads of statistical modeling at Capital One, so don't trust my judgement, trust theirs.

Another interesting implementation detail is that typically modelers transform the inputs to the model via [quantization](https://en.wikipedia.org/wiki/Quantization). Typically through a transformation called the [Weight of Evidence](https://multithreaded.stitchfix.com/blog/2015/08/13/weight-of-evidence/).

Additionally, an important piece of credit risk modeling is the requirement to grant adverse action codes in the case of rejecting a customer who applies for a credit product (this is a requirement from FCRA). Doing this algorithmitically is very doable and different people do it slightly differently but the short version is taking the aboslute larget partial prediction (i.e., $partial_j = x_j * \beta_j$,  $\forall j=1,..., k$).

Lastly, when building these statistical models the most important thing to think about is the trade-off between complexity and performance on your target population. Typically in the lending space you will not approve all of your customers, so obsessing over model fit on the proportion of your population that won't be approved is not always useful. It's a small point, but extremely consequential and will hopefully save you some time.

## Conclusion

This tutorial was not nearly as code heavy as I would have liked (only showing a very silly regression) but I felt like the content was dense outside of it. People spend their careers studying these statistical models and the important consequences of them, so I really want to emphasize how much I have trivialized the work here only for the sake of simplicity. I have not talking about how you can improve the model when it's underperforming or how one can try to measure biases that may occur, but these are important pieces for society.

I will conclude by saying that while simplistic, these models are tightly modeled and governed by many layers of regulation. As a statistician and a minority, I think this is a good thing. That's not to say that harm isn't caused by these models because I think there is but I do think machines are able to be governed, evaluated, and modified unlike human decision making which can be subjective and prone to unknown biases.

I hope you found this post useful and interesting.

*Have some feedback? Feel free to [let me know](https://twitter.com/franciscojarceo)!*