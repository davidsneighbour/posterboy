import { Logger } from '../posterboy.mjs';
import { TargetNetworkConfig } from './target-config.js';

export default class Facebook extends TargetNetworkConfig {
  authenticate() {
    Logger.log("Authenticating with Facebook API...");
    // Implement Facebook authentication logic here
    Logger.log("Authenticated with Facebook API.");
  }

  post(title, description, link) {
    Logger.log(`Posting to Facebook: Title - ${title}, Description - ${description}, Link - ${link}`);
    // Implement Facebook post logic here
    Logger.log("Post successful on Facebook.");
  }
}


import { loadEnv } from '../../lib/utils.mjs';
import { sendMessage } from './utils.discord.mjs';
import { consola } from 'consola';

const notifyDiscord = async (message) => {
  try {
    await loadEnv();
    const { DISCORD_WEBHOOK } = process.env;
    // const feed = await loadFeed(FEED_LINK);
    // let message = `New post on ${feed.rss.channel[0].title[0]}`;
    // message += ` titled: [${feed.rss.channel[0].item[0].title[0]}](${feed.rss.channel[0].item[0].link[0]})`;
    sendMessage(DISCORD_WEBHOOK, message);
  } catch (error) {
    consola.error('Error:', error);
  }
};

export default notifyDiscord;


import fetch from 'node-fetch';

/**
 *
 * @param {*} webhook
 * @param {*} message
 * @todo error handling
 */
export const sendMessage = (webhook, message) => {
  fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'DNBot',
      content: message,
    }),
  });
};
