import toml from 'toml';
import { consola } from "consola";
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Custom merge function to handle merging of arrays based on unique keys.
 * @param {Object} defaultConfig - The default configuration object.
 * @param {Object} userConfig - The user configuration object.
 * @returns {Object} - The merged configuration object.
 */
export function mergeConfigs(defaultConfig, userConfig) {
  const mergedConfig = { ...defaultConfig };

  for (const key in userConfig) {
    if (Array.isArray(userConfig[key]) && Array.isArray(defaultConfig[key])) {
      const mergedArray = [...defaultConfig[key]];

      for (const userItem of userConfig[key]) {
        const index = mergedArray.findIndex(defaultItem => defaultItem.slug === userItem.slug);
        if (index !== -1) {
          mergedArray[index] = { ...mergedArray[index], ...userItem };
        } else {
          mergedArray.push(userItem);
        }
      }

      mergedConfig[key] = mergedArray;
    } else if (typeof userConfig[key] === 'object' && userConfig[key] !== null) {
      mergedConfig[key] = mergeConfigs(defaultConfig[key] || {}, userConfig[key]);
    } else {
      mergedConfig[key] = userConfig[key];
    }
  }

  return mergedConfig;
}

/**
 * Loads and merges configuration from default and user config files.
 * @returns {Object} - The merged configuration object.
 */
export function loadAndMergeConfig() {
  // Read TOML configuration
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const defaultConfigPath = path.resolve(__dirname, 'config.default.toml');
  const userConfigPath = path.resolve(__dirname, 'config.toml');

  let defaultConfig;
  let userConfig = {};

  try {
    const defaultConfigFile = fs.readFileSync(defaultConfigPath, 'utf8');
    defaultConfig = toml.parse(defaultConfigFile);
  } catch (err) {
    consola.error(`Error reading default TOML config file: ${err}`);
    process.exit(0);
  }

  if (fs.existsSync(userConfigPath)) {
    try {
      const userConfigFile = fs.readFileSync(userConfigPath, 'utf8');
      userConfig = toml.parse(userConfigFile);
    } catch (err) {
      consola.error(`Error reading user TOML config file: ${err}`);
      process.exit(0);
    }
  }

  const config = mergeConfigs(defaultConfig, userConfig);

  consola.log('Merged configuration:', config);

  return config;
}
