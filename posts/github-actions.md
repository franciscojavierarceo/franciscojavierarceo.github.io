---
title: 'Deploying a Next.js site using Github Actions'
date: '2020-01-03'
description: "GitHub Actions to Deploy a Static Site built with Next.js"
---

I'm a huge fan of [GitHub Actions](https://github.com/features/actions). They're so simple but so effective at doing such a broad range of things. In short, you can tell GitHub do something on a computer everytime you push to your repository (or to a branch on a specific repository like the `main` branch).

For today's post, I'll focus on how I used an action to automate deploying my static site built with Next.js to [GitHub Pages](https://pages.github.com).

I made this blog on a repository hosted on GitHub and added an action to compile the JavaScript/React into static HTML files. This really didn't require all that much effort.

Here's what I had to do:

0. Built a Next.js blog following the [detailed tutorial](https://nextjs.org/learn/basics/create-nextjs-app) and store the code on a GitHub repository
1. Create a workflow file in the repository with the following path: [`./github/workflows/integrate.yml`](https://github.com/franciscojavierarceo/franciscojavierarceo.github.io/blob/main/.github/workflows/integrate.yml)
2. Specify that workflow file to export the static files whenever I push to `main` and *commit* the exported files to a separate branch called `gh-pages` (you can just follow the workflow file I used)
3. Manually add a `.nojekyll` file to the `gh-pages` branch (this is to resolve [this bug](https://github.com/vercel/next.js/issues/2029))
4. Configure my repository branch settings so that sources the GitHub Pages build from the `gh-pages` branch
5. Push to the `main` branch with new files!

And that's it, adding new blog posts is as simple as creating a new [markdown](https://www.markdownguide.org/) file and pushing to the main branch. The GitHub Action will handle all of the rest!

This is much nicer in behavior than my old site, which was built using Jekyll (a Ruby framework)