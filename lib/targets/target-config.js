class TargetNetworkConfig {
  constructor() {
    if (this.constructor === SocialMediaNetwork) {
      throw new Error("Cannot instantiate abstract class SocialMediaNetwork directly.");
    }

    if (typeof this.authenticate !== 'function') {
      throw new Error("Classes extending SocialMediaNetwork must implement authenticate method.");
    }

    if (typeof this.post !== 'function') {
      throw new Error("Classes extending SocialMediaNetwork must implement post method.");
    }
  }

  authenticate() {
    throw new Error("Method 'authenticate()' must be implemented.");
  }

  post(title, description, link) {
    throw new Error("Method 'post()' must be implemented.");
  }
}
