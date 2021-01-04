---
title: 'Deploying a Next.js site using Github Actions'
date: '2020-01-03'
description: "GitHub Actions to Deploy a Static Site built with Next.js"
---

I'm a huge fan of GitHub Actions. They're so simple but so effective at doing such a broad range of things. For today's post, I'll focus on how I used <a href="https://github.com/features/actions">GitHub Actions</a> to automate deploying my static site built with Next.js to <a href="https://pages.github.com/">GitHub Pages</a>.

I made this blog on a repo in GitHub and added a github action to `npm build export` to compile the JavaScript into static HTML files. This really didn't require all that much effort.

Here's what I had to do:

1. Create a [`./github/workflows/integrate.yml`](https://github.com/franciscojavierarceo/franciscojavierarceo.github.io/blob/main/.github/workflows/integrate.yml) file
2. Specify that workflow file to export the static files and commit them my own branch called `gh-pages`
3. Manually add a `.nojekyll` file to the `gh-pages` branch
4. Configure my repository branch settings for github to source the build from `gh-pages`
5. Push to main!