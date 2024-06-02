import { readCache, writeCache } from '../../lib/cache.mjs';
import { fetchReleases } from '../../lib/autoposter.utils.mjs';

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

/**
 * generates a GitHub API URL for repository releases.
 *
 * @param {string} repo - the GitHub repository in the format "username/reponame".
 * @returns {string} - the GitHub API URL for the repository releases.
 * @throws {Error} - if the input is invalid.
 */
export function generateGitHubApiUrl(repo) {
  if (typeof repo !== 'string') {
    throw new Error('Input must be a string');
  }

  const regex = /^[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+$/;
  if (!regex.test(repo)) {
    throw new Error('Input must be in the format "username/reponame" and contain no special characters');
  }

  return `https://api.github.com/repos/${repo}/releases`;
}
