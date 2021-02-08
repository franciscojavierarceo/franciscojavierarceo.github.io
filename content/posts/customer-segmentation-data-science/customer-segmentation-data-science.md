---
title: 'Customer Segmentation using Data Science'
description: A Data Scientists Guide to Segmenting your Customers using clustering algorithms and decision trees.
date: 2021-02-06
---

*TL;DR: A Data Science Tutorial on using K-Means and Decision Trees together.*

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

To skip over many important details ([more here](https://towardsdatascience.com/customer-segmentation-using-k-means-clustering-d33964f238c3)), K-Means is an algorithm that optimally buckets your data into $K$ groups (according to a specific mathematical function called the [euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance)). It's a classic approach and tends to work quiet well in practice (there are a ton of other neat [clustering algorithms](https://en.wikipedia.org/wiki/Cluster_analysis#Algorithms)) but one non-technical challenge is (1) choosing $K$ and (2) explaining what a single cluster actually means to literally anyone else.

Solving (1) is relatively straight-forward. You can run K-means for some number of $K$ from [0, $m$] ($m > 0$ and choose what appears to be a $k$ that sufficiently minimizes the within-cluster sum-of-squares (i.e., $\sum_{i=0}^{n} min_{\mu_j \in C}||x_i - \mu_j||^2$). Here notice that the the majority of the variation of the clusters can be capture by $k=6$.

![The Inertia Function!](inertia.png)
<p align="center" style="padding:0"><i>Inertia as a function of k</i></p>

Now to (2), which is the harder challenge. If I were to plot my data and look at the clusters, I'd have something that looks like:

![K-Means!](kmeans.png)
<p align="center" style="padding:0"><i>Look at all 3 of those beautiful dimensions!</i></p>

How cool, right? This little algorithm learned pretty clear groups that you can see rather clearly in the data. Impressive! And also useless to your boss. 

More seriously, while you can see these clusters, you can't actually extract a clear description from it, which makes interpreting it really, really hard when you go past 3 dimensions.

So what can you do to make this slightly more meaningful?

Enter [decision trees](https://en.wikipedia.org/wiki/Decision_tree). Another elegant, classic, and amazing algorithm. Decision Trees basically split up your data using simple `if-else` statements. So, a trick that you can use is to take the predicted clusters and run a Decision Tree (Classification) to predict the segment and use the learneed Tree's logic as your new business logic.

I find this little trick pretty fun and effective since I can more easily describe how a machine learned a segment and I can also inspect it. Let's suppose I ran my tree on this learned K-means, what would the output look like?

![Decision Tree Ouput!](decisiontree.png)
<p align="center" style="padding:0"><i>Is this really more interpretable?</i></p>

And there you have it, now you have a segmentation that is closer to optimal and somewhat easier to interpret. It's still not as good as the business definition but you could actually read through this and eventually come up with a heuristic driven approach as well, which is why I like it and why I've used it in the past.

Finally, here's the code to run the K-means and the Decision tree.
```python
import plotly
import pydotplus
import numpy as np        
import pandas as pd
import matplotlib.pyplot as plt 
import seaborn as sns 
import plotly.graph_objs as go
from sklearn.cluster import KMeans
from sklearn import metrics
from sklearn.tree import DecisionTreeClassifier
from sklearn.tree import export_graphviz
from sklearn.externals.six import StringIO  
from IPython.display import display
from IPython.display import Image  
plotly.offline.init_notebook_mode()

%matplotlib inline

def plot_clusters_3d(xdf: pd.DataFrame, xcols: list, predcol: str, cluster_colors: list, ptitle: str) -> None:
    '''
    Helper function to plot the clusters of an aglorithm given the predicted clusters
    
    Parameters
    ---------
    xdf : pandas.DataFrame
        Input data frame of attributes and predicted cluster
    
    xcols : list
        List of field names 
    
    xcol : str
        Predicted cluster name
    
    cluster_colors : list
        List of colors for plotting
    ptitle: str
        Plot title
    '''
    assert len(cluster_colors) == xdf[predcol].nunique(), 'Must have a color for each cluster'
    plot_list = []
    for predicted_cluster, cluster_color in zip(xdf[predcol].unique(), cluster_colors):
        clusterdata = xdf[xdf[predcol] == predicted_cluster][xcols]
        cluster_scatter = {
            'mode' : "markers",
            'name' : "Cluster %s" % (predicted_cluster + 1),
            'type' : "scatter3d",    
            'x' : clusterdata.values[:,0],
            'y' : clusterdata.values[:,1], 
            'z' : clusterdata.values[:,2],
            'marker' : {'size': 2, 'color':cluster_color},        
        }
        cluster_centroid = {
            'alphahull': 5,
            'name': 'Cluster %s' % (predicted_cluster + 1),
            'opacity': 0.1,
            'type': 'mesh3d',
            'x': clusterdata.values[:,0],
            'y': clusterdata.values[:,1],
            'z': clusterdata.values[:,2],
            'color': cluster_color,
            'showscale': True
        }
        plot_list.append(cluster_scatter)
        plot_list.append(cluster_centroid)
    
    layout = {
        "title" : ptitle,
        "scene" : {
            'xaxis': {"zeroline": True, "title": 'Age'}, 
            'yaxis': {"zeroline": True, "title": 'Spending Score (0-100)'}, 
            'zaxis': {"zeroline": True, "title": "Annual Income ($K)"},
        },
        "width": 1000,
        "height": 800,
        "margin": go.layout.Margin(
            l=50,
            r=50,
            b=100,
            t=100,
            pad=4
        ),
        "plot_bgcolor": '#c7c7c7'
    }

    fig = {'data': plot_list, 'layout': layout}
    plotly.offline.iplot(fig, filename='mesh3d_sample')

# Here CDF is short for "Customer Data Frame"
cdf = pd.read_csv("customer-segmentation-tutorial-in-python.zip")
cdf.rename({'Annual Income (k$)': 'Annual Income ($K)'}, inplace=True, axis=1)

# Removing gender though we could certainly add it is a binary field
cdf['x'] = cdf['Age']
cdf['y'] = cdf['Spending Score (1-100)']
cdf['z'] = cdf['Annual Income ($K)']

xcols = ['x', 'y', 'z']
xcol_labels = ['Age', 'Spending Score (1-100)', 'Annual Income ($K)']

# Setting this to a max of 11 Clusters
k = 11

X1 = cdf[xcols].values
inertia = []
for i in range(1 , k):
    kmeans_model = (KMeans(n_clusters = i ,init='k-means++', n_init = 10 ,max_iter=300, 
                        tol=0.0001,  random_state= 111  , algorithm='elkan') )
    kmeans_model.fit(X1)
    inertia.append(kmeans_model.inertia_)

plt.figure(1 , figsize = (15 ,6))
plt.plot(np.arange(1 , 11) , inertia , 'o')
plt.plot(np.arange(1 , 11) , inertia , '-' , alpha = 0.5)
plt.xlabel('Number of Clusters') , plt.ylabel('Inertia')
plt.title("Inertia as a function of the Number of Clusters (k)")
plt.grid()
plt.show()

optimal_clusters = 6
# 6 clusters 6 colors
xcolors = ['red', 'green', 'blue', 'orange', 'purple', 'gray']
# Chose 6 as the best number of clusters
kmeans_model = (KMeans(n_clusters = optimal_clusters ,init='k-means++', n_init = 10 ,max_iter=300, 
                        tol=0.0001,  random_state= 111  , algorithm='elkan') )
kmeans_model.fit(X1)
cdf['pred_cluster_kmeans'] = kmeans_model.labels_
centroids = kmeans_model.cluster_centers_

display(pd.DataFrame(cdf['pred_cluster_kmeans'].value_counts(normalize=True)))

clf = DecisionTreeClassifier()
# Train Decision Tree Classifer
clf = clf.fit(X1, cdf['pred_cluster_kmeans'])

# Predict the response for test dataset
cdf['pred_class_dtree'] = clf.predict(X1)

display(pd.crosstab(cdf['pred_cluster_kmeans'], cdf['pred_class_dtree']))
dot_data = StringIO()
export_graphviz(
    decision_tree=clf, 
    out_file=dot_data,  
    filled=True, 
    rounded=False,
    impurity=False,
    special_characters=True, 
    feature_names=xcol_labels, 
    class_names=cdf['pred_cluster_kmeans'].unique().astype(str).tolist(),

)
graph = pydotplus.graph_from_dot_data(dot_data.getvalue())  
graph.write_png("./decisiontree.png")
```

*Have some feedback? Feel free to [let me know](https://twitter.com/franciscojarceo)!*