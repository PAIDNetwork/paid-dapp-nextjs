const path = require('path');

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'sass')],
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.tls = false;
    }

    return config
  }
};
