---
title: 'Data Science and FinTech'
description: How Data Science Scaled the FinTech Revolution
date: 2021-01-22
---

I've spent the last 10 years working in data science, mostly in Fintech and it's been really exciting to have seen how data science, engineering, and the internet has reshaped all aspects of finance.

[Others have written before](https://fintechtoday.substack.com/p/part-1-what-is-fintech-30-anyway) about how Fintech has evolved from 0.0 to 3.0 over the last decade and one area that I think is interesting is how data science and analytics has helped fuel that growth.

>So, how *exactly* has data science helped scale fintech?

I think primarily in 5 areas with a handful of approaches.

## 1. Operations

The market tends to have a preference for technology companies because of the operational efficiencies that come from technology's scale. Data scientists help identify data and processes that can be automated to help achieve better operational efficiency.

A concrete Fintech example of this is fraud operations.
If you're a bank with a credit card product, manually reviewing even 10% of your credit card transactions would be an impossible task (it's been [cited](https://www.marketwatch.com/story/why-bitcoin-wont-displace-visa-or-mastercard-soon-2017-12-15) that Visa and Mastercard process 5,000 transactions per second).

So, in this circumstance data scientists will build models to reduce the amount of review needed through predictive models.

## 2. Marketing

In Fintech, Customer Acquisition Cost (CAC) is everything. Others have written about [CAC and Fintech](https://medium.com/unifimoney/the-no-cac-bank-5e0e577d5473) in greater depth, but suffice it to say it is a challenging, competitive problem.

Data scientists focused on marketing try to reduce CAC through a wide variety of strategies.
Some of them are by tightly monitoring product metrics to see which features yield the best ROI on growth, while other approaches take a broader lense by trying to take a comprehensive view of your marketing investments and, again, trying to optimize the expected return (e.g., through [Marketing Mix Models](https://blog.hurree.co/blog/marketing-mix-modeling)).

Other approaches are more focused on [propensity models](https://medium.com/the-official-integrate-ai-blog/heres-what-you-need-to-know-about-propensity-modeling-521ab660cb43) and trying to maximize customer engagement or acquisition. Sometimes this involves building propensity models to convert a customer from an email subscriber to a fully-converted user (e.g., for a lending product), while other propensities may focus on simply getting a customer to re-engage with your product.

## 3. Risk Management

This is where I've spent most of my career and I think it's a really hard problem that most fintechs struggle with in the lending space.
Generally speaking, data scientists will build risk models (e.g., for credit risk or fraud risk) to predict the probability of default or some likelihood of delinquency ([more on the difference between them](https://www.investopedia.com/ask/answers/062315/what-are-differences-between-delinquency-and-default.asp)).

Building good predictive models is hard. Building good *risk* models is extremely hard.

This is less because of a technology or data problem and more because of regulatory checks and balances in place. Making sure that you adhere to [FCRA](https://www.ftc.gov/enforcement/statutes/fair-credit-reporting-act) and [ECOA](https://uscode.house.gov/view.xhtml?req=granuleid%3AUSC-prelim-title15-chapter41-subchapter4&edition=prelim) and other regulatory oversight.

Implementation (i.e., getting an algorithm in production that impacts your customers) of these models is a whole other area of data science and one of the areas I personally find quite fun (maybe I'll write more abou this topic later).

## 4. Technology

Occassionally, data scientists will work with engineering/technology teams in order to improve the technology stack. This may involve changing an architecture to reducy latency of certain services or enhancing the curent stack for a unique problem (cew machine learning and Airflow DAGs).
While some of this is behind the scenes, it can be some of the most impactful work done by a data scientist in the fintech space.

## 5. Customer Experience

Data scientists working with product teams are often tasked with measurement of different experiences within the product and finding out ways to enhance it. That can vary from creating dashboards to monitor something custom to building a recommendation system to curate something specific for a user.

