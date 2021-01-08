const fs = require('fs');
const globby = require('globby');
const prettier = require('prettier');

(async () => {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');

  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await globby([
    'content/posts/',
    '!pages/_*.js',
    '!pages/api'
  ]);
  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>https://franciscojavierarceo.github.io</loc>
                <changefreq>daily</changefreq>
                <priority>0.8</priority>
            </url>
            ${pages
              .map((page) => {
                const path = page
                  .replace('content/','')
                  .replace("posts/", 'post/')
                  .replace('pages', '')
                  .replace('.js', '')
                  .replace('.md', '');
                console.log(page);
                const spath = path.split('/');
                spathfin = spath.slice(0, spath.length -1).join('/')
                const route = spathfin === '/index' ? '' : spathfin;

                return `
                        <url>
                            <loc>${`https://franciscojavierarceo.github.io/${route}`}</loc>
                            <changefreq>daily</changefreq>
                            <priority>0.5</priority>
                        </url>
                    `;
              })
              .join('')}
        </urlset>
    `;

  // If you're not using Prettier, you can remove this.
  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html'
  });

  fs.writeFileSync('public/sitemap.xml', formatted);
})();