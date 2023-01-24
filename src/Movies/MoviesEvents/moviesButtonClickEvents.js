const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const Guild = require("../../Schemas/guild");

const { getMoviesMoviePage } = require('../../Movies/moviesMoviePage.js')

const getMovie = async () => {
  const guild = interaction.guild
  const guildId = guild.id
  const guildProfile = await Guild.findOne({ guildId: guildId });

  const moviesData = guildProfile.moviesData
  const movieList = moviesData.movieList || []

  let movieDetails = movieList.find((movie) => {
    return movie.name === selectedMovieName
  })

  return { guildProfile, moviesData, movieDetails }
}

module.exports = {
  async addMovieButtonClicked(data) {
    const { interaction, selectedGenre = '' } = { ...data }

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
        )]);

    const genreInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('AddMovieGenreInput')
        .setLabel('Genre')
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(30)
        .setPlaceholder('Movie Genre')
        .setRequired(true),
    )
    const selectedGenreValue = selectedGenre !== 'All Genres' ? selectedGenre : ''
    if (selectedGenreValue) {
      genreInput.components[0].setValue(selectedGenreValue)
    }

    modal.addComponents([
      genreInput,
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
    ])

    await interaction.showModal(modal);
  },

  async editMovieButtonClicked(data) {
    const { interaction, movieId } = { ...data }
    if (!movieId) return

    const guild = interaction.guild
    const guildId = guild.id
    const guildProfile = await Guild.findOne({ guildId: guildId });

    const moviesData = guildProfile.moviesData
    const movieList = moviesData.movieList || []
    const movieDetails = await movieList.find((movie) => {
      return movie._id === movieId
    })

    const modal = new ModalBuilder()
      .setCustomId(`EditMovieModalSubmit_${movieId}`)
      .setTitle(`Edit ${movieDetails.name}`)
      .addComponents([
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('EditMovieNameInput')
            .setLabel('Movie Name')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(70)
            .setPlaceholder('Movie Name')
            .setRequired(true)
            .setValue(movieDetails.name),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('EditMovieGenreInput')
            .setLabel('Genre')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(30)
            .setPlaceholder('Movie Genre')
            .setRequired(true)
            .setValue(movieDetails.genre),
        )])
    const descriptionInput =
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('EditMovieDescriptionInput')
          .setLabel('Optional Description')
          .setStyle(TextInputStyle.Paragraph)
          .setMinLength(1)
          .setMaxLength(200)
          .setPlaceholder('Movie Description')
          .setRequired(false),
      )
    if (movieDetails.description) descriptionInput.components[0].setValue(movieDetails.description)

    const imageURLInput =
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('EditMovieImageInput')
          .setLabel('URL to an image for the movie')
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(150)
          .setPlaceholder('Image URL')
          .setRequired(false)
      )
    if (movieDetails.imageURL) imageURLInput.components[0].setValue(movieDetails.imageURL)

    const movieURLInput =
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('EditMovieURLInput')
          .setLabel('IMBD, Wikipedia or Rotten Tomatoes URL')
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(100)
          .setPlaceholder('URL')
          .setRequired(false)
      )
    if (movieDetails.movieURL) movieURLInput.components[0].setValue(movieDetails.movieURL)

    modal.addComponents([
      descriptionInput,
      imageURLInput,
      movieURLInput
    ])

    await interaction.showModal(modal);
  },

  async getRandomMovieButtonClicked(data) {
    const { interaction, selectedGenre } = { ...data }
    const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, selectedGenre })

    return await interaction.update({
      components,
      embeds: embeddedMessage
    })
  },

  async getSpecificMovieButtonClicked(data) {
    const { interaction, movieId } = { ...data }
    const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, movieId })

    return await interaction.update({
      components,
      embeds: embeddedMessage,
    })
  },

  async toggleMovieWatchedButtonClicked(data) {
    const { interaction, movieId, isMovieWatched } = { ...data }

    const guild = interaction.guild
    const guildId = guild.id
    const guildProfile = await Guild.findOne({ guildId: guildId });

    const moviesData = guildProfile.moviesData
    const movieList = moviesData.movieList || []

    let movieDetails = movieList.find((movie) => {
      return movie._id === movieId
    })

    movieDetails.isMovieWatched = isMovieWatched === 'false' ? 'true' : 'false'

    await Guild.updateOne(
      { _id: guildProfile._id },
      { $set: { moviesData: moviesData } }
    )

    const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, movieId })

    return await interaction.update({
      components,
      embeds: embeddedMessage,
    })
  }
}