const stringifyPackage = require('stringify-package');
const detectIndent = require('detect-indent');
const detectNewline = require('detect-newline');

module.exports.readVersion = function (contents) {
  return JSON.parse(contents).properties.userAgent.default;
};

module.exports.writeVersion = function (contents, version) {
  const json = JSON.parse(contents);
  let indent = detectIndent(contents).indent;
  let newline = detectNewline(contents);
  json.properties.userAgent.default = 'posterboy/v' + version;
  return stringifyPackage(json, indent, newline);
};
