const { activateEasterEvent } = require('./Easter/easterEvent');
const {
  doEasterEvilBunnyHunt,
} = require('./Easter/EasterEvilBunny/easterEvilBunnyHunt');

module.exports = {
  activateSeasonalEvents(client) {
    // activateEasterEvent(client)
    doEasterEvilBunnyHunt({ client });
  },
};
