<h1 align="center">
  My personal site using Next.js
</h1>

I built this site using Next.js's tutorial <a href="https://nextjs.org/learn/basics/create-nextjs-app/setup">here</a> based on a template provided by [@jfelix](https://github.com/JoseRFelix) and modified it to use Github Actions to deploy it to Github Pages.

## ✏ Features

- Automated deployment to Github Pages
- Streamlined styling experience with [Tailwind.css](https://tailwindcss.com/).
- Customizable typographic defaults with [Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography)
- Automatic image preview and optimization with [next-optimized-images](https://github.com/cyrilwanner/next-optimized-images).
- Lazyload images.
- Absolute imports.
- SEO friendly.
- Markdown code highlighting with [react-syntax-highlighter](https://www.npmjs.com/package/react-syntax-highlighter) and [PrismJs](https://prismjs.com/).
- Dark Mode
- WebP image support

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## ✍ Customizing Tailwind Typography

[Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography) is an official tailwind plugin that provides a set of `prose` classes to add beautiful typographic defaults to any vanilla HTML you don't control (like HTML rendered from Markdown, or pulled from a CMS).

To customize the defaults provided by the plugin, add the overrides under the `typography` key in the theme section of the `tailwind.config.js` file. Refer to its [default styles](https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js) for more in-depth examples.

For more information, please check out Tailwind Typography's [customization section](https://github.com/tailwindlabs/tailwindcss-typography#customization).

## 📖 Learn More

### Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/zeit/next.js/) - your feedback and contributions are welcome!

### Tailwind CSS

To learn more about Tailwind CSS, take a look at the following resources:

- [Tailwind Documentation](https://tailwindcss.com/) - learn about Tailwind CSS features and API.

## ☑ Upcoming features

- [X] Add Sitemap
- [x] Dark Mode
- [x] Add support for WebP images
- [x] Add SEO Component
- [x] Add Dynamic Site Metadata