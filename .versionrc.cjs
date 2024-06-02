const defaultStandardVersion = require('@davidsneighbour/release-config');


// update version in fetch configuration
const tracker = {
  filename: "config.schema.json",
  updater: require("./helpers/schema-version-updater.cjs"),
};

const localStandardVersion = {
  bumpFiles: [
    {
      filename: "package.json",
      type: "json",
    },
    tracker,
  ],
};
const standardVersion = {
  ...defaultStandardVersion,
  ...localStandardVersion,
};
module.exports = standardVersion;
