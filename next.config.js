module.exports = {
    async headers() {
        return [
          {
            source: '/sitemap.xml',
            headers: [
              {
                key: 'Content-type',
                value: 'application/xml',
              }
            ],
          },
        ]
      },
};
