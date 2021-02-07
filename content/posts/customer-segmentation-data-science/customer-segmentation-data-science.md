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

The phrase "Customer Segments" tends to mean different things across different industries, organizations, and even across business functions (e.g., marketing, risk, product, etc.). 

As an example, for a consumer products retailer, they may refer to customer segments using both demographic information or their purchase behavior, where a lender may refer to their segments based on credit score bands. While very meaningfully different from a business perspective, the same algorithms can be used for both problems.

Analytically speaking, I've seen Customer Segments defined really in two main ways: (1) Business Segments and (2) Algorithmic Segments. Usually executives refer to their segments in the first category and data scientists focus on the second. The first is really important organizationally because 99% of the people working with your customers don't care about how you bucketed them and customers are the most important thing. Always.

...but how do you *actually* (i.e., in code and data) get to those segments?

### 1. Logical Business Segments
These segments tend to be defined by heuristics and things that make common sense. They are often built on things that are aligned with the goal of the business.

Here are some examples:

- The age of the customer (in years)
- The income of the customer (in dollars or thousands of dollars)
- The amount of money a customer spent in the last year
- The likelihood a customer will spend money at a given store (purchase propensity / propensity to buy)
- The customer's geographic region (e.g., zipcode, state)
- In data, some of that customer information would look something like this:

<table>
  <tr>
    <th>User ID</th>
    <th>Age</th>
    <th>Customer Income</th>
    <th>Purchase Propensity</th>
    <th>...</th>
  </tr>
  <tr>
    <td>1</td>
    <td>25</td>
    <td>$45,000</td>
    <td>0.9</td>
    <td>...</td>
  </tr>
  <tr>
    <td>2</td>
    <td>30</td>
    <td>$80,000</td>
    <td>0.4</td>
    <td>...</td>
  </tr>
  <tr>
    <td>...</td>
    <td>...</td>
    <td>...</td>
    <td>...</td>
    <td>...</td>
  </tr>
  <tr>
    <td>n</td>
    <td>56</td>
    <td>$57,000</td>
    <td>0.1</td>
    <td>...</td>
  </tr>
</table>
And so on.

We would apply some logic/code to create segment like:

- Age Buckets
    1. < 25
    2. 25-35
    3. 35-55
    4. 55+
- Income Buckets
    1. < $25K
    2. $25K-50K
    3. $50K-100K
    4. $100-150K
    5. $150K+
- Propensity Buckets
    1. Low: [0, 0.25]
    2. Medium: [0.25, 0.75]
    3. High: [0.75, 1.0]

And map that logic into our data:
<table>
  <tr>
    <th>User ID</th>
    <th>Age Bucket</th>
    <th>Income Bucket</th>
    <th>Propensity Bucket</th>
    <th>...</th>
  </tr>
  <tr>
    <td>1</td>
    <td>25-35</td>
    <td>$25K-50K</td>
    <td>High</td>
    <td>...</td>
  </tr>
  <tr>
    <td>2</td>
    <td>25-35</td>
    <td>$50K-100K</td>
    <td>Medium</td>
    <td>...</td>
  </tr>
  <tr>
    <td>...</td>
    <td>...</td>
    <td>...</td>
    <td>...</td>
    <td>...</td>
  </tr>
  <tr>
    <td>n</td>
    <td>56</td>
    <td>$50K-100K</td>
    <td>Low</td>
    <td>...</td>
  </tr>
</table>
And so on.

Pretty simple, right? The code for this is simple too (assuming you're using Pandas and Python; though it's also simple in SQL).

# Here's one example
```python
cdf['Income Bucket'] = pd.cut(cdf['Annual Income ($K)'], 
    bins=[0, 25, 35, 55, np.inf], 
    labels=['<25', '25-35', '35-55', '55+']
)
```
This is a really helpful and simple way to understand our customers and it's the way that most businesses do analytics, but we can do more. 😊

### 2. Algorithmic Segments

Segments defined using simple business logic are great because they are so simple and easy to interpret, but that's not free.
By favoring simplicity we have to limit ourselves to (potentially) suboptimal segments. 
This is typically on purpose and entirely fine but, again, we can do better.

So how do we do better?

Cue statistics, data mining, analytics, machine learning, or whatever it's called this week. More specifically, we can use the classic [K-Means Clustering](https://en.wikipedia.org/wiki/K-means_clustering) algorithm to *learn* an optimal set of segments given some set of data.

To skip over many important details ((more reading here)[https://towardsdatascience.com/customer-segmentation-using-k-means-clustering-d33964f238c3]), K-Means is an algorithm that optimally buckets your data into $K$ groups (according to a specific mathematical function called the [euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance)). It's a classic approach and tends to work quiet well in practice (there are a ton of other neat [clustering algorithms](https://en.wikipedia.org/wiki/Cluster_analysis#Algorithms)) but one non-technical challenge is (1) choosing $K$ and (2) explaining what a single cluster actually means to a non-technical stakeholder.




