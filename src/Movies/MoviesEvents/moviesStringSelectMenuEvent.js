const Guild = require("../../Schemas/guild");
const mongoose = require("mongoose");
const { getMoviesOverviewPage } = require('../moviesOverviewPage.js');

module.exports = {
  async genreSelectMenuClicked (interaction) {
    const selectedGenre = interaction.values[0]
    const { components, embeddedMessage } = await getMoviesOverviewPage({ interaction, selectedGenre })

    await interaction.update({
      components,
      embeds: embeddedMessage
    })
  }
}