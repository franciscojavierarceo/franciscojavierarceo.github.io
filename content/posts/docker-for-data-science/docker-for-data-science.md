---
title: 'How to use Docker to Launch a Jupyter Notebook'
description: A Data Scientists Guide to using Docker containers to quickly spin up a Jupyter Notebook
date: 2021-02-13
---

*TL;DR: A Data Science Tutorial on the benefits of Docker.*

## Some History
I began my foray into what's now called [Data Science](https://en.wikipedia.org/wiki/Data_science) back in 2011. I was doing my first master's in economics and statistics and I was doing econometrics research on consumer demand based on survey data using [SAS](https://www.sas.com/en_us/company-information.htmlhttps://www.sas.com/en_us/company-information/profile.html).

![Look at that rise!](data-science-google-trends.png)
<p align="center" style="padding:0"><i>Looks like I graduated at an interesting time.</i></p>

Technology was *much* different then, distributed computing and Open Source Software (OSS) was only starting to get the popularity and attention it has now. More practically, most businesses weren't using cloud services, they were using their own servers for storing and managing their data (i.e., real physical machines) with fixed RAM and a lot of overhead (read: chaos when the power goes out).

The most sophisticated analytical shops used SAS* to process their data since it was a very efficient way to analyze large data out of memory.

But it wasn't fault tolerant or stable. Software libraries for different mathematical frameworks have evolved so much over time and they just kept changing, so the infrastructure kept changing, too.

In short, the way data scientists did analytics was pretty brittle: most places didn't use version control or servers; code was sent via emails; and deploying models was usually done in an Oracle/MySQL table that ran a query, joins, and a sum-product. It was the Wild West.

Cloud computing and OSS changed the game. [R](https://cran.r-project.org), [Python](https://www.python.org), [Hadoop](https://hadoop.apache.org), [Spark](https://spark.apache.org), [CUDA](https://developer.nvidia.com/cuda-toolkit), and other frameworks completely influenced how we thought about that infrastructure.

Python, in particular, has been one of the greatest contributions to data science and it has truly helped push the field further.

## Python, the Beautiful

Python wasn't the original data science language, R and SAS were much more popular back in the early and mid-2010s but two popular data mining libraries helped Python skyrocket in the data science community ([sklearn](https://scikit-learn.org/stable/) and [xgboost](https://en.wikipedia.org/wiki/XGBoost)). Then in 2015 people made advances in deep learning frameworks (moving away from [Theano](https://en.wikipedia.org/wiki/Theano_(software))) and creating things like [Caffe](https://caffe.berkeleyvision.org), [Keras](https://en.wikipedia.org/wiki/Keras), [Tensorflow](https://en.wikipedia.org/wiki/TensorFlow), and eventually [PyTorch](https://en.wikipedia.org/wiki/PyTorch) (my personal favorite).

All of the stuff under the hood changed dramatically and it made the infrastructure around deploying these models change dramatically, too.

The ever-evolving software made getting data science infrastructure up and running really annoying, time consuming, and eventually kind of wasteful because it would get stale quickly, but the world has evolved again.

Cue [Docker](https://en.wikipedia.org/wiki/Docker_(software)) and the emergence of [containerization](https://hackernoon.com/what-is-containerization-83ae53a709a6).

## Docker and Jupyter Notebooks

Docker is basically a way to easily configure a mini-computer in your computer. The idea being, that if you configure it with a single file declaring what stuff (i.e., software) you need in it, you can deploy that same container to some production environment. In real, customer-facing applications even a small subversion change of a single library can break your entire service.

Docker can help mitigate that risk.

![It works on my machine!](docker.jpg)
<p align="center" style="padding:0"><i>This meme is suprisingly accurate.</i></p>

What's interesting is that people have made attempts at doing similar things for a long time ([virtual environments](https://virtualenv.pypa.io/en/latest/), [Pyenv](https://github.com/pyenv/pyenv), [virtual box](https://www.virtualbox.org), etc.) and while most of them were helpful, they all still had really annoying issues come up constantly...but Docker is much more comprehensive.

So how is that relevant for Python and data scientists? Well, if you're doing data science work, odds are you're probably using Python or R and you might be doing that work using a [Jupyter Notebook](https://jupyter.org). 

The [Jupyter Project](https://jupyter.org/about) has created a wonderful [Data Science](https://hub.docker.com/r/jupyter/datascience-notebook/) docker image that allows you to trivially get up and running.

All you have to do is [install Docker](https://docs.docker.com/engine/install/) and run the following in your terminal:

```bash
docker run -it -p 8888:8888 -v /your/folder/:/home/jovyan/work --rm --name jupyter jupyter/datascience-notebook
```
You'll see some output and at the end of it you should see something like: 

```
[C 2021-02-14 14:37:06.596 ServerApp] 
    
    To access the server, open this file in a browser:
        file:///home/jovyan/.local/share/jupyter/runtime/jpserver-6-open.html
    Or copy and paste one of these URLs:
        http://7c94e4cf2dc1:8888/lab?token=this-will-be-a-magical-token
     or http://127.0.0.1:8888/lab?token=this-will-be-a-magical-token
```
Click on that link in your terminal and you should be directed to a page that looks like the image below:

![So many options!](docker-for-data-science.png)
<p align="center" style="padding:0"><i>Who is using Julia these days?</i></p>

And there you have it, you can start ripping through all sorts of data in minutes!

A great benefit of this particular docker image is that it has most of the Python/R libraries you want already out of the box but if you want to add another, you can do that right in your notebook by using [Jupyter Magic](https://ipython.readthedocs.io/en/stable/interactive/magics.html) in a cell like so:
```bash
%pip install snowflake
```

![Simple install](pip_install.png)
<p align="center" style="padding:0"><i>Wow, that was easy.</i></p>

And now you can use that library. See how nice it is not to have to [dual boot](https://en.wikipedia.org/wiki/Multi-booting) your computer to install something?

## Conclusion

Data science infrastructure is going to continue to evolve very heavily, so I imagine this post will be outdated in 2 years but currently this is an extremely fast and painless way to get up and running.

I can't emphasize enough how miserable managing different Operating System (OS), Python, or other software library versions really is. Debugging these things used to take days or weeks and now it's just trivial, so I'd really recommend this approach. An added benefit is that this will also save you an extraordinary amount of time when you go to deploy your model...but more on that later. 😉

*Have some feedback? Feel free to [let me know](https://twitter.com/franciscojarceo)!*

---
*As a brief side note, the history of SAS is amazing and I really recommend reading the [Wikipedia page](https://en.wikipedia.org/wiki/SAS_Institute) on it. Most of the large banks, pharmaceutical firms, several government agencies, research institutions, and other major organizations in the world still operate on SAS because it's so deeply embedded into their business. Now, that technology can no longer be decoupled from their core infrastructure, which is interesting.*