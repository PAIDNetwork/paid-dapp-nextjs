import * as Sentry from "@sentry/nextjs";

const { name, version } = require('./package.json');
const SENTRY_APP_RELEASE = `${name}@${version}`;

Sentry.init({
  dsn: "https://46bd757e8d9c4e128f525015dffd8e97@o910595.ingest.sentry.io/5900878",
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  release: SENTRY_APP_RELEASE,
  environment: process.env.ENV,
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});