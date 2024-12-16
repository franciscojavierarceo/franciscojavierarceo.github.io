const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
  [optimizedImages, {
    handleImages: ['jpeg', 'png', 'svg', 'webp', 'gif'],
  }],
], {
  webpack: (config, { isServer }) => {
    // Add our rule for all JS files including node_modules
    config.module.rules.push({
      test: /\.(js|jsx|mjs)$/,
      include: [
        /node_modules[\\/]@react-spring/,
        /node_modules[\\/]@react-spring.*[\\/]dist/,
        /node_modules[\\/]htmlparser2/,
        /node_modules[\\/]domutils/,
        /node_modules[\\/]domelementtype/,
        /pages/,
        /components/,
        /utils/
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                node: '14',
                browsers: ['last 2 versions']
              },
              useBuiltIns: 'usage',
              corejs: 3,
              modules: 'commonjs'
            }],
            '@babel/preset-react'
          ],
          plugins: [
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
            ['@babel/plugin-transform-runtime', {
              regenerator: true,
              corejs: 3
            }],
            '@babel/plugin-transform-modules-commonjs'
          ]
        }
      }
    });

    // Handle Node.js built-in modules for client-side (webpack 4 compatible)
    if (!isServer) {
      config.node = {
        fs: 'empty',
        path: 'empty'
      };
    }

    return config;
  },
  // Basic Next.js config
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx'],
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [{ key: 'Content-Type', value: 'application/xml' }],
      },
    ];
  },
});
