const path = require('path');
const { withSentryConfig } = require("@sentry/nextjs");

const ENV = process.env.ENV

const moduleExports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'sass')],
  },
};

const SentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};


module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);