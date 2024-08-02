// socialMediaModule.js

// Logging utility
class Logger {
  static log(message) {
    console.log(`[INFO] ${message}`);
  }

  static error(message) {
    console.error(`[ERROR] ${message}`);
  }
}


// Main class for executing posts
class SocialMediaManager {
  constructor() {
    this.networkModules = {
      'facebook': './facebook.js',
      'twitter': './twitter.js'
    };

    this.postConfigModules = {
      'blogpost': './blogPostConfig.js',
      'productpost': './productPostConfig.js'
    };
  }

  async loadModule(modulePath) {
    const { default: ModuleClass } = await import(modulePath);
    return new ModuleClass();
  }

  async loadNetworkModule(networkName) {
    if (!this.networkModules[networkName.toLowerCase()]) {
      throw new Error(`Unsupported network: ${networkName}`);
    }

    const modulePath = this.networkModules[networkName.toLowerCase()];
    return this.loadModule(modulePath);
  }

  async loadPostConfigModule(postConfigName) {
    if (!this.postConfigModules[postConfigName.toLowerCase()]) {
      throw new Error(`Unsupported post config: ${postConfigName}`);
    }

    const modulePath = this.postConfigModules[postConfigName.toLowerCase()];
    return this.loadModule(modulePath);
  }

  async executePost(networkName, postConfigName) {
    try {
      const network = await this.loadNetworkModule(networkName);
      const postConfig = await this.loadPostConfigModule(postConfigName);

      const title = postConfig.getTitle();
      const description = postConfig.getDescription();
      const link = postConfig.getLink();

      network.authenticate();
      network.post(title, description, link);
    } catch (error) {
      Logger.error(error.message);
    }
  }

  async execute({ networkName, postConfigName }) {
    await this.executePost(networkName, postConfigName);
  }
}

// Exporting all required classes
export { Logger, SocialMediaManager };
