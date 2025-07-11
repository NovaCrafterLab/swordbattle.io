const Logger = require('../utils/Logger');

class Account {
  constructor(data) {
    this.id = null;
    this.username = '';
    // Other account properties are loaded from API
    this.update(data);
  }

  update(data) {
    Object.assign(this, data);
    if (this.skins && typeof this.skins === 'string') {
      try {
        this.skins = JSON.parse(this.skins);
      } catch (e) {
        Logger.server.error('Error parsing account skins', {
          accountId: this.id,
          error: e.message,
        });
      }
    }
  }
}

module.exports = Account;
