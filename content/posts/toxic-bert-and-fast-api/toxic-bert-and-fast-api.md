---
title: Bert Transformers, FastAPI, and Toxic Twitter
description: A Data Scientist's Guide to using FastAPI and BERT to Build a twitter scanner of your tweets.
date: 2021-04-11
---

## I will write less frequently

Unfortunately, I've been writting a little less frequently than I was hoping to this year; I was targetting about once a week but I think that was (1) a little too frequent and (2) a little too ambitious of me to think I'd be able to keep up that pace.

## I will write more quality

I'll aim to write once or a month or so and hope for higher quality posts. 

In the spirit of more interesting content (and more interesting problems for me to tinker with) in the Twitter thread below I decided I'd write a blog post on building a webtool that scans a user's historical tweets and identifies the highest risk ones.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Is there an ML type service that can plow through history for potentially problematic tweets?</p>&mdash; Matt Galligan (@mg) <a href="https://twitter.com/mg/status/1372923621040082944?ref_src=twsrc%5Etfw">March 19, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I decided to work on this because (1) it's at the intersection of things I really enjoy (nlp, web development, and twittter), (2) I wanted to build a tool that would solve a real problem, and (3) I thought it'd be fun.

## Creating a Toxic Twitter Scanner

I think this tool can be broken down into 3 sub-problems:
1. Creating a web service to handle the front-end user experience (authentication and rendering of data)
2. Creating a machine learning model as an endpoint that handles predicting the toxicity/problematicness of a user's tweets
3. Connecting (1) and (2) and deploying them as a service in an automated way

There's a bunch of stuff in between and technical things to handle, but this is really what I think matters at a high-level, so let's dive in!

### 1. Creating a Web Service
As a web tool, a user should be able to authenticate with Twitter to scan their tweets and consent to the service using their data (this is to access private tweets). As a starting point, I'll probably launch this tool without any authentication and just look at a user's public tweets.

### 2. Creating a Machine Learning model as an API
This is a reasonably straightforward process as the endpoint will be a wrapper around an existing machine learning library and the goal is to be able to send in some data and get some scores back.

### 3. Connecting a Web Service to an ML API
This is an important step. In summary, we want to decouple the user-facing experience from the machine learning because they have very different technical requirements. The compute cluster that'll create predictions for the tweets will use much more memory than the user-facing application, so it's important to separate them so computing doesn't slow down the user experience.

## Progress on Building a Scanner

So far I've been diving into using a pre-trained BERT model developed by [Laura Hanu](https://laurahanu.github.io) at [Unitary](https://www.unitary.ai) and it's been pretty fun. I've been able to score my own tweets and see the behavior of this model and see various implementation details that I'll have to be mindful of (I'll probably write more on this later).

I've been tinkering with [FastAPI](https://fastapi.tiangolo.com) and figuring out how the [cookie-cutter template](https://fastapi.tiangolo.com/project-generation/) works. I don't love the way it behaves and there's a lot of strong opinions in place which is helpful but imperfect; we'll see how my opinion shapes as I spend more time with it.

I'm very excited to learn [Docker Swarm](https://docs.docker.com/get-started/swarm-deploy/) as it seems like a very promising framework for deploying the model API.

You can follow my progress on this [GitHub repository](https://github.com/franciscojavierarceo/twitter-scan). Stay tuned as I'll be updating this blog with my thoughts as I chip away at this problem.

---
*Have some feedback? Feel free to [let me know](https://twitter.com/franciscojarceo)!*
