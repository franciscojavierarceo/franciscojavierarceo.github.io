---
title: Deploying a Next.js Site using Github Actions
description: GitHub Actions to Deploy a Static Site built with Next.js
date: 2020-01-03
---

I'm a huge fan of [GitHub Actions](https://github.com/features/actions). They're so simple but so effective at doing such a broad range of things. In short, you can tell GitHub do something on a computer everytime you push to your repository (or to a branch on a specific repository like the `main` branch).

For today's post, I'll focus on how I used an action to automate deploying my static site built with Next.js to [GitHub Pages](https://pages.github.com).

I made this blog on a repository hosted on GitHub and added a GirHub Action to compile the JavaScript/React code into static HTML files. This really didn't require all that much effort.


Here's what I had to do:

1. Build a Next.js blog following the [detailed tutorial](https://nextjs.org/learn/basics/create-nextjs-app) and store the code on a GitHub repository
2. Create a workflow file in the repository with the following path: [`./github/workflows/integrate.yml`](https://github.com/franciscojavierarceo/franciscojavierarceo.github.io/blob/main/.github/workflows/integrate.yml)
3. Specify that workflow file to export the static files whenever I push to `main` and *commit* the exported files to a separate branch called `gh-pages` (you can just follow the workflow file I used)
4. Manually add a `.nojekyll` file to the `gh-pages` branch (this is to resolve [this bug](https://github.com/vercel/next.js/issues/2029))
5. Configure my repository Settings so that it sources the GitHub Pages build from the `gh-pages` branch

And that's it, adding new blog posts is as simple as creating a new [markdown](https://www.markdownguide.org/) file and pushing to the `main` branch. The GitHub Action will handle all of the rest!

This is much nicer in behavior than my old site, which was built using Jekyll (a Ruby framework) and it's much less work than building a full application with Django to get high quality page loads. I’d add that I’m a huge fan of Django but I think for a static, fast, and lightweight site, Next.js my new go to!