import fs from 'fs';
import { globby } from 'globby';
import prettier from 'prettier';

// Make the entire script async
(async () => {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');

  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await globby([
    'content/posts/',
    'pages/*.js',
    '!pages/index.js',
    '!pages/_*.js',
    '!pages/api',
    '!pages/sitemap.xml.js'
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
                  .replace('pages/', '')
                  .replace('.js', '')
                  .replace('.md', '');
                const spath = path.split('/');
                let spathfin;
                if (spath.length === 1) {
                  spathfin = spath[0];
                } else {
                  spathfin = spath.slice(0, spath.length -1).join('/');
                }                
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

  try {
    const formatted = await prettier.format(sitemap, {
      ...prettierConfig,
      parser: 'html'
    });
    fs.writeFileSync('public/sitemap.xml', formatted);
    return formatted;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
})();
