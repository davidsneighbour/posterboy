// main.js
import { SocialMediaManager } from './socialMediaModule.js';

(async () => {
  const manager = new SocialMediaManager();

  // Execute for Facebook with BlogPostConfig
  await manager.execute({
    networkName: 'facebook',
    postConfigName: 'blogpost'
  });

  // Execute for Twitter with ProductPostConfig
  await manager.execute({
    networkName: 'twitter',
    postConfigName: 'productpost'
  });
})();
