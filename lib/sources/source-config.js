class SourceConfig {
  constructor() {
    if (this.constructor === SourceConfig) {
      throw new Error("Cannot instantiate abstract class SourceConfig directly.");
    }

    if (typeof this.getTitle !== 'function') {
      throw new Error("Classes extending SourceConfig must implement getTitle method.");
    }

    if (typeof this.getDescription !== 'function') {
      throw new Error("Classes extending SourceConfig must implement getDescription method.");
    }

    if (typeof this.getLink !== 'function') {
      throw new Error("Classes extending SourceConfig must implement getLink method.");
    }

    if (typeof this.getLastPost !== 'function') {
      throw new Error("Classes extending SourceConfig must implement getLastPost method.");
    }
  }

  getLastPost() {
    throw new Error("Method 'getLastPost' must be implemented.");
  }

  getTitle() {
    throw new Error("Method 'getTitle()' must be implemented.");
  }

  getDescription() {
    throw new Error("Method 'getDescription()' must be implemented.");
  }

  getLink() {
    throw new Error("Method 'getLink()' must be implemented.");
  }
}
