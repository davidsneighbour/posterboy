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
