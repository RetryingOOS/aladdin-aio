module.exports = {
  webpack: {
    configure: {
      target: 'electron-renderer',
      module: {
        rules: [
          // rules for modules (configure loaders, parser options, etc.)
          {
            test: /\.(?:png|jpg|svg)$/,
            loader: 'url-loader',
            query: {
              // Inline images smaller than 10kb as data URIs        limit: 10000
            },
          },
        ],
      },
    },
  },
};
