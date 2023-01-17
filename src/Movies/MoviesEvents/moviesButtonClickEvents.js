const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');

const { getMoviesMoviePage } = require('../../Movies/moviesMoviePage.js')

module.exports = {
  async addMovieButtonClicked (data) {
    const { interaction, selectedGenre = '' } = { ...data }
    const selectedGenreValue = selectedGenre !== 'All Genres' ? selectedGenre : '\u200b'

    const modal = new ModalBuilder()
      .setCustomId(`AddMovieModalSubmit_${selectedGenre}`)
      .setTitle('Add Movie')
      .addComponents([
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('AddMovieNameInput')
            .setLabel('Movie Name')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(70)
            .setPlaceholder('Movie Name')
            .setRequired(true),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('AddMovieGenreInput')
            .setLabel('Genre')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(30)
            .setPlaceholder('Movie Genre')
            .setRequired(true)
            .setValue(selectedGenreValue),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('AddMovieDescriptionInput')
            .setLabel('Optional Description')
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(1)
            .setMaxLength(200)
            .setPlaceholder('Movie Description')
            .setRequired(false),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('AddMovieImageInput')
            .setLabel('URL to an image for the movie')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(150)
            .setPlaceholder('Image URL')
            .setRequired(false),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('AddMovieURLInput')
            .setLabel('IMBD, Wikipedia or Rotten Tomatoes URL')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(100)
            .setPlaceholder('URL')
            .setRequired(false),
        ),
      ]);

    await interaction.showModal(modal);
  },

  async getRandomMovieButtonClicked (data) {
    const { interaction, selectedGenre } = { ...data }
    const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, selectedGenre })

    return await interaction.update({
      components,
      embeds: embeddedMessage
    })
  },

  async getSpecificMovieButtonClicked (data) {
    const { interaction, movieName } = { ...data }
    const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, movieName })

    return await interaction.update({
      components,
      embeds: embeddedMessage,
    })
  }
}