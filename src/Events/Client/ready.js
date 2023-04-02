const { Events } = require('discord.js');
const { activateSeasonalEvents } = require('./SeasonalEvents/seasonalEvents');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute (client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    activateSeasonalEvents(client)
  }
}