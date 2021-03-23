---
title: Github Actions, Docker, and the Beloved Cron
description: Using GitHub Actions to run a Python script inside of a docker container scheduled daily.
date: 2021-03-14
---

I've written before about my love for [Github Actions](https://franciscojavierarceo.github.io/post/github-actions) and [Docker](https://franciscojavierarceo.github.io/post/docker-for-data-science).

A little over a week ago I tweeted that I was interested in writing a blog post about using Github Actions and Docker to schedule a job to do something interesting, but I didn't have a fun use case. 

Fortunately, my internet friends delivered.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">text me with a pic of your dog</p>&mdash; Camilo (@camdotbio) <a href="https://twitter.com/camdotbio/status/1367856131972947972?ref_src=twsrc%5Etfw">March 5, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

So I decided to write a quick script to do this, and that's how I spent my Friday evening as my wife and I watched Avengers. 😂

I've provided a link to the [Github Repository](https://github.com/franciscojavierarceo/twitter-cron-demo) with the full code but here's the short instructions if you're interested.

## 1. Register for a developer account on [Twitter](https://developer.twitter.com/en/apply-for-access) and get your API credentials

This is a pretty easy process and you just sign up and outline what you're doing (it's also free). Note that you'll need to store 4 variables in a `.env` file like below:

    TWITTER_API_KEY=
    TWITTER_API_SECRET=
    TWITTER_ACCESS_TOKEN=
    TWITTER_ACCESS_TOKEN_SECRET=

## 2. Write a Python Script to Tweet a Dog Photo

This was pretty straightforward thanks to the [Tweepy](https://www.tweepy.org) library in Python and this super random [dog photo API](https://dog.ceo/dog-api/) (God bless the internet).

Here's what that Python code looks like:

```python
import os
import json
import requests
import tweepy

def get_random_dog(filename: str='temp') -> None:
    r = requests.get('https://dog.ceo/api/breeds/image/random')
    rd = json.loads(r.content)
    r2 = requests.get(rd['message'])

    with open(filename, 'wb') as image:
        for chunk in r2:
            image.write(chunk)

def main(message: str, filename: str='temp') -> None:
    auth = tweepy.OAuthHandler(
        os.environ.get('TWITTER_API_KEY'), 
        os.environ.get('TWITTER_API_SECRET')
    )
    auth.set_access_token(
        os.environ.get('TWITTER_ACCESS_TOKEN'), 
        os.environ.get("TWITTER_ACCESS_TOKEN_SECRET")
    )
    api = tweepy.API(auth)
    get_random_dog(filename) 

    try:
        api.verify_credentials()
        print("Twitter Authentication Succeeded")
    
        try:
            api.update_with_media(filename, status=message)
            print('Tweet successfully sent!')

        except Exception as e:
            print('Error sending tweet \n %s' % e)
    except:
        print("Twitter Authentication Failed")


if __name__ == '__main__':
    main("Hey, @camdotbio! 👋 \n\nHere's your daily dog photo!")
```

## 3. Create a Docker Container to run the Python Script 

This is a contentious area where some may argue docker is execessive for this but I use different computers with different operating systems so this works for me and I like it. 

In short, I created a [Dockerfile](https://github.com/franciscojavierarceo/twitter-cron-demo/blob/main/Dockerfile) and a [docker-compose](https://github.com/franciscojavierarceo/twitter-cron-demo/blob/main/docker-compose.yml) file where I run the script. The benefit of this is that I don't have to worry about this script not working on my Linux machine or not working on my Mac, it works on both!

## 4. Use a Github Action to Schedule a Cron Job

This was also straightforward and I've copied the code below:

```yml
name: Build and Deploy 🚀

on:
    schedule:
        - cron: '0 15 * * *'

jobs:
    build:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v2

            - name: Make envfile
              uses: SpicyPizza/create-envfile@v1
              with:
                  envkey_TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
                  envkey_TWITTER_API_SECRET: ${{ secrets.TWITTER_API_SECRET }}
                  envkey_TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
                  envkey_TWITTER_ACCESS_TOKEN_SECRET: ${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}
                  file_name: .env

            - name: Build the docker container
              run: docker build .

            - name: Run the script 🚀
              run: docker-compose up
```
Note that you have to create [Action Secrets](https://docs.github.com/en/actions/reference/encrypted-secrets) in your Github Repository (available in the Settings tab) and add the credentials from Step 1.

## Conclusion 

And that's it! 🐶 

Pushing the code to GitHub handles the rest, isn't that wonderful?

Anyways, thanks to my internet friends for the fun idea. I didn't end up sending it to Camilo's phone number because I would have to pay Twilio $0.0075.

---
*Have some feedback? Feel free to [let me know](https://twitter.com/franciscojarceo)!*