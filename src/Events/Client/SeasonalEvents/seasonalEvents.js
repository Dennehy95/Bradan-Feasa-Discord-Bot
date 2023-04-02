const { activateEasterEvent } = require('./Easter/easterEvent');

module.exports = {
  activateSeasonalEvents (client) {
    activateEasterEvent(client)
  }
}