const { SlashCommandBuilder } = require('discord.js');
const { getMoviesOverviewPage } = require('../Movies/moviesOverviewPage.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('movies')
    .setDescription('Movie Lists'),

  async execute (interaction) {
    let isEphemeral = false
    // if (interaction.options?._hoistedOptions.length) {
    //   isEphemeral = interaction.options?._hoistedOptions.find(option => option.name === 'hide').value
    // }

    const { components, embeddedMessage } = await getMoviesOverviewPage({ interaction })

    await interaction.reply({
      components,
      ephemeral: isEphemeral,
      embeds: embeddedMessage
    })
  }
}
