import https from 'node:https';
import consola from 'consola';

import { cacheFileExists, readCache, writeCache } from './cache.mjs';

// fetch the list of releases from GitHub
export async function fetchReleases(url, userAgent) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': userAgent,
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const releases = JSON.parse(data);
          resolve(releases);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

export async function fetchLatestItem(config) {
  const { repoUrl, cacheFilePath, userAgent } = config;
  const releases = await fetchReleases(repoUrl, userAgent);
  const cachedIDs = await readCache(cacheFilePath);
  const newRelease = releases.find(release => !cachedIDs.includes(release.id));

  if (newRelease) {
    cachedIDs.push(newRelease.id);
    await writeCache(cacheFilePath, cachedIDs);
    return { title: newRelease.tag_name, url: newRelease.html_url };
  }

  return null;
}

// initialize the cache with all existing releases
async function initializeCacheWithAllReleases({ repoUrl, cacheFilePath, userAgent }) {
  const releases = await fetchReleases(repoUrl, userAgent);
  const releaseIDs = releases.map(release => release.id);
  await writeCache(cacheFilePath, releaseIDs);
  consola.log('Cache initialized with all release IDs.');
}

// manage the GitHub releases
export async function manageReleases({ repoUrl, cacheFilePath, userAgent }) {
  const exists = await cacheFileExists(cacheFilePath);

  if (!exists) {
    await initializeCacheWithAllReleases({ repoUrl, cacheFilePath, userAgent });
    consola.log('Cache file did not exist and has been initialized. Run the script again to get the latest release.');
    return;
  }

  const releases = await fetchReleases(repoUrl, userAgent);
  const cachedIDs = await readCache(cacheFilePath);
  const newRelease = releases.find(release => !cachedIDs.includes(release.id));

  if (!newRelease) {
    consola.log('No new releases found.');
    return null;
  }

  consola.log(`New release found: ${newRelease.tag_name}`);
  consola.log(`Release URL: ${newRelease.html_url}`);

  cachedIDs.push(newRelease.id);
  await writeCache(cacheFilePath, cachedIDs);
  consola.log('Cache updated successfully with the new release ID.');

  return { tagName: newRelease.tag_name, htmlUrl: newRelease.html_url };
}

/**
 * create the configuration object for fetching
 *
 * @param {Object} overrideConfig - The configuration object to merge on top of the base.
 * @returns {Object} - The merged configuration object.
 */
export function createFetchConfig(overrideConfig) {

  const cachefilename = overrideConfig.type + '-' + overrideConfig.slug;
  const mergedConfig = {
    userAgent: 'posterboy/v0.0.1',
    cacheFilePath: 'cache/' + cachefilename + '.json'
  };

  Object.keys(overrideConfig).forEach(key => {
    mergedConfig[key] = overrideConfig[key];
  });

  return mergedConfig;
}
