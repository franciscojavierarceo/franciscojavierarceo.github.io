---
title: 'Data Science and Fintech'
description: How Data Science Scaled the Fintech Revolution
date: 2021-01-22
---

I've spent the last 10 years working in data science, mostly in finance and technology (fintech) and it's been really exciting to see how data science, engineering, and the internet has reshaped all aspects of finance.

[Others have written before](https://fintechtoday.substack.com/p/part-1-what-is-fintech-30-anyway) about how fintech has evolved over the last decade and one area that I think is interesting is how data science and analytics has helped fuel that growth.

>So, how ***exactly*** has data science helped scale fintech?

I think data science has scaled fintech in five key areas.

## 1. Operations<a name="Operations"></a>

The market tends to have a preference for technology companies because of the operational efficiencies that come from technology's scale. Simply put, data scientists help identify data and processes that can be automated to help achieve better operational efficiency.

A concrete fintech example of this is fraud operations. If you're a bank with a credit card product, manually reviewing even 10% of your credit card transactions would be an impossible, and costly, task (it's been [cited](https://www.marketwatch.com/story/why-bitcoin-wont-displace-visa-or-mastercard-soon-2017-12-15) that Visa and Mastercard process 5,000 transactions per second, which would mean that there are 5000 * 60 * 60 * 24=432,000,000 transactions per day to go through).

So, in this circumstance data scientists build technology and predictive models to reduce the amount of manual review.

## 2. Marketing<a name="Marketing"></a>

In fintech, Customer Acquisition Cost (CAC) is everything. Others have written about [CAC and fintech](https://medium.com/unifimoney/the-no-cac-bank-5e0e577d5473) in greater depth, but suffice it to say it is a challenging and competitive problem.

Data scientists focused on marketing try to reduce CAC through a wide variety of strategies.
Some of them are by tightly monitoring product metrics to see which features yield the best ROI for growth, while other approaches take a broader lense by taking a comprehensive view of your marketing investments and, again, optimize the expected return (e.g., through [Marketing Mix Models](https://blog.hurree.co/blog/marketing-mix-modeling)).

Other marketing focused approaches use [propensity models](https://medium.com/the-official-integrate-ai-blog/heres-what-you-need-to-know-about-propensity-modeling-521ab660cb43) to try to maximize customer engagement or acquisition. More concretely, this can involve building a propensity model to convert a customer from an email subscriber to a fully-converted user (e.g., for a lending product or a mobile application), while other propensities may focus on simply getting a customer to re-engage with your product.

## 3. Risk Management<a name="Risk-Management"></a>

This is where I've spent most of my career and I think it's a really hard problem that most fintechs struggle with in the lending space.
Generally speaking, data scientists will build risk models (e.g., for credit risk or fraud risk) to predict the probability of default or some likelihood of delinquency ([more on the difference between them](https://www.investopedia.com/ask/answers/062315/what-are-differences-between-delinquency-and-default.asp)).

Building good predictive models is hard. Building good *risk* models is **extremely** hard.

This is less because of a technology or data problem and more because of regulatory checks and balances in place. Making sure that you adhere to [FCRA](https://www.ftc.gov/enforcement/statutes/fair-credit-reporting-act), [ECOA](https://uscode.house.gov/view.xhtml?req=granuleid%3AUSC-prelim-title15-chapter41-subchapter4&edition=prelim), and other regulatory oversight is hard on its own, adding statistical analysis into the mix makes it more challenging.

Implementation (i.e., getting an algorithm into production that impacts your customers) of these models is a whole other area of data science and one of the areas I personally find quite fun (maybe I'll write more about this topic later).

## 4. Technology<a name="Technology"></a>

Data scientists often work with engineering/technology teams in order to improve the technology stack. This may involve changing an architecture to reduce the latency of certain [microservices](https://microservices.io/) or enhancing the curent stack for a unique problem (cue machine learning and [Airflow DAGs](https://airflow.apache.org)).
While some of this is behind the scenes, it can be some of the most impactful work done by a data scientist in the fintech space because of the broader impact to the core business.

## 5. Product<a name="Product"></a>

Data scientists working with product teams are often tasked with the measurement of different experiences within the product and finding out ways to enhance it. That can vary from creating dashboards to monitor the right metrics, to building a recommendation system to curate something specific for a user. 

Data scientists can fuel product growth, which is why [Facebook, Google, Amazon, Microsoft](https://www.datasciencedegreeprograms.net/lists/five-of-the-largest-companies-that-employ-data-scientists/) and other tech companies hire so many data scientists.

It's worth noting that I've ignored many of the technology and organizational complexities involved when hiring or building data science teams but only because I wanted to keep this post high-level to introduce some of the applications of data science to fintech. In the future, I'll probably write more technical posts of each one of these to give more concrete examples with code and diagrams (which is what I find fun 😊). 

So, to summarize, data scientists are useful (particularly in fintech) when there are hard problems and data available to solve them.

*Have some feedback? Feel free to [let me know](https://twitter.com/franciscojarceo)!*