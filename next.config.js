/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    loader: 'default',
    domains: [],
  },
};

module.exports = nextConfig;
