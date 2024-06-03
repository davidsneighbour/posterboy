const defaultStandardVersion = require('@davidsneighbour/release-config');

const tracker = {
  filename: 'config.schema.json',
  updater: require('./helpers/versioning/schema-updater.cjs'),
};

const localStandardVersion = {
  bumpFiles: [
    {
      filename: 'package.json',
      type: 'json',
    },
    tracker,
  ],
};

const standardVersion = {
  ...defaultStandardVersion,
  ...localStandardVersion,
};

module.exports = standardVersion;
