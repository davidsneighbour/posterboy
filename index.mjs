// @see https://github.com/natemoo-re/clack/tree/main/packages/prompts#readme
import *  as prompts from '@clack/prompts';
import toml from 'toml';
// @see https://github.com/unjs/consola
import { consola } from "consola";
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformConfig, getObjectBySlug } from './lib/helper.mjs';
import pc from "picocolors"
import { createFetchConfig } from './lib/autoposter.utils.mjs';
import notifyDiscord from './targets/discord/notify.discord.mjs';

// read TOML configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.resolve(__dirname, 'config.toml');
let config;
try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  config = toml.parse(configFile);
} catch (err) {
  consola.error(`Error reading TOML config file: ${err}`);
  process.exit(0);
}

async function main() {

  // pick source
  const source = await prompts.select({
    message: 'Pick a source',
    options: transformConfig(config.sources),
  });
  if (prompts.isCancel(source)) {
    prompts.cancel('Operation cancelled.');
    process.exit(0);
  }
  let sourceData = getObjectBySlug(config.sources, source);

  // fetch source items
  let fetchFunction, latestItem;
  try {
    if (sourceData.type === 'github') {
      const githubModule = await import('./sources/github/from.github.mjs');
      fetchFunction = githubModule.fetchLatestItem;
      try {
        sourceData.repoUrl = githubModule.generateGitHubApiUrl(sourceData.repo);
      } catch (error) {
        consola.error(error.message);
      }
      sourceData = createFetchConfig(sourceData);
    } else if (sourceData.type === 'rss') {
      ({ fetchLatestItem: fetchFunction } = await import('./sources/rss/from.rss.mjs'));
    } else {
      throw new Error('Unsupported source type');
    }
    const spinner = prompts.spinner();
    spinner.start('Loading latest post');
    latestItem = await fetchFunction(sourceData);
    spinner.stop('Done');
  } catch (error) {
    consola.error(`Error fetching items from source: ${error}`);
    process.exit(0);
  }

  const targets = await prompts.multiselect({
    message: 'Select target:',
    options: transformConfig(config.targets),
    required: false,
  });

  // act on selected targets
  const validTargets = ['discord', 'mastodon'];
  targets.forEach(target => {
    if (!validTargets.includes(target)) {
      consola.error(`Error: Target ${target} is not supported.`);
    } else {
      consola.success(`Processing target: ${target}`);
      let targetData = getObjectBySlug(config.targets, target);

      if (target === 'discord') {
        consola.log('Posting to Discord...');
        notifyDiscord();
      } else if (target === 'mastodon') {
        consola.log('Posting to Bluesky...');
      }

      console.log(targetData);
    }
  });

  // post another one or exit
  const nextStep = await prompts.select({
    message: 'Next step',
    options: [
      { value: 'repeat', label: 'Post another item' },
      { value: 'exit', label: 'Finish Up' },
    ],
  });
  if (nextStep === 'repeat') {
    main();
  } else {
    prompts.outro('All done!');
  }

}

prompts.intro(`${pc.green(pc.bold("Social Media Poster by @davidsneighbour"))}`);
main().catch(consola.error);
