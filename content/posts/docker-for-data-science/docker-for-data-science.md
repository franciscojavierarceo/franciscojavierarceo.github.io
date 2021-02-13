---
title: 'How to use Docker to Launch a Jupyter Notebook'
description: A Data Scientists Guide to using Docker containers to quickly spin up a Jupyter Notebook
date: 2021-02-13
---

*TL;DR: A Data Science Tutorial on building the benefits of Docker.*

## Some History
I began my foray into what's now called [Data Science](https://en.wikipedia.org/wiki/Data_science) back in 2011. I was doing my first master's in economics and statistics and I was doing econometrics research on consumer demand based on survey data, using [SAS](https://en.wikipedia.org/wiki/SAS_Institute).

Technology was *much* different then, distributed computing and Open Source Software (OSS) was only starting to get the popularity and attention it has now. And more practically, most businesses weren't using cloud services. Most businesses were still using their own servers for storing and managing their data (i.e., real physical machines) with fixed RAM and a lot of overhead (read: chaos when the power goes out).

For the most sophisticated analytical shops, they used SAS to process their data, since it was a very efficient way to analyze data out of memory. 

*As a brief side note, the history of SAS is amazing and I really recommend reading the Wikipedia page on it. Most of the large banks in the world still operate on SAS because it's been around so long. Now, that technology can no longer be decoupled from core banking infrastructure, which is interesting.*

But it wasn't fault tolerant or stable. Software libraries for different mathematical frameworks have evolved so much over time and they just kept changing, so the infrastructure kept changing, too. In short, the way data scientists did analytics was pretty brittle. Most places didn't use version control or servers. Code was sent via emails and deploying models was usually done in an Oracle/MySQL table that ran a query, joins, and a sum-product (if at all). It was the wild west.

Cloud computing and OSS changed the game. R, Python, Hadoop, Spark, CUDA, and other frameworks completely trivialized so much of that infrastructure.

Python, in particular, has been one of the greatest contributions to data science and it has truly helped push the field further.

## Python, the Beautiful


## Docker and Jupyter Notebooks

```
docker run -it -p 8888:8888 -v /your/folder/:/home/jovyan/work --rm --name jupyter jupyter/datascience-notebook
```
