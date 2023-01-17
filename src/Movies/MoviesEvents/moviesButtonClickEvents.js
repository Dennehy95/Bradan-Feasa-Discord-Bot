const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const Guild = require("../../Schemas/guild");

const { getMoviesMoviePage } = require('../../Movies/moviesMoviePage.js')

const getMoviesData = async () => {


  return { guildProfile, moviesData, movieDetails }
}

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
      genreInput.setValue(selectedGenreValue)
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
    const { interaction, selectedMovieName } = { ...data }
    if (!selectedMovieName) return

    const guild = interaction.guild
    const guildId = guild.id
    const guildProfile = await Guild.findOne({ guildId: guildId });

    const moviesData = guildProfile.moviesData
    const movieList = moviesData.movieList || []

    let movieDetails = movieList.find((movie) => {
      return movie.name === selectedMovieName
    })
    const { name, genre, movieURL, description, imageURL } = { ...movieDetails }

    const modal = new ModalBuilder()
      .setCustomId(`EditMovieModalSubmit_${selectedMovieName}`)
      .setTitle(`Edit ${selectedMovieName}`)
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
            .setValue(name),
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
            .setValue(genre),
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
    if (description) descriptionInput.setValue(description)

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
    if (imageURL) movieURLInput.setValue(imageURL)

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
    if (movieURL) movieURLInput.setValue(movieURL)

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
    const { interaction, movieName } = { ...data }
    const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, movieName })

    return await interaction.update({
      components,
      embeds: embeddedMessage,
    })
  },

  async toggleMovieWatchedButtonClicked(data) {
    const { interaction, movieName, isMovieWatched } = { ...data }

    const guild = interaction.guild
    const guildId = guild.id
    const guildProfile = await Guild.findOne({ guildId: guildId });

    const moviesData = guildProfile.moviesData
    const movieList = moviesData.movieList || []

    let movieDetails = movieList.find((movie) => {
      return movie.name === movieName
    })

    movieDetails.isMovieWatched = isMovieWatched === 'false' ? 'true' : 'false'

    await Guild.updateOne(
      { _id: guildProfile._id },
      { $set: { moviesData: moviesData } }
    )

    const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, movieName })

    return await interaction.update({
      components,
      embeds: embeddedMessage,
    })
  }
}