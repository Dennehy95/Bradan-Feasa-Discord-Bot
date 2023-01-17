const Guild = require("../../Schemas/guild");
const mongoose = require("mongoose");
const { getMoviesMoviePage } = require('../moviesMoviePage.js')
const { getMoviesOverviewPage } = require('../moviesOverviewPage.js');

const NON_ALLOWED_GENRES = ['All genres', 'Any', 'Any Genre', 'All']

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

module.exports = {
  async addMovieModalSubmit(data) {
    const { interaction, selectedGenre = '' } = { ...data }
    const guildId = interaction.guild.id;
    let guildProfile = await Guild.findOne({ guildId: guildId });
    if (!guildProfile) {
      const noticeMessage = `Error adding movie`
      const { components, embeddedMessage } = await getMoviesOverviewPage({ interaction, noticeMessage, selectedGenre })
      return await interaction.update({
        components,
        embeds: embeddedMessage
      })
    }

    const newMovieName = interaction.fields.getTextInputValue('AddMovieNameInput');
    const newMovieGenre = interaction.fields.getTextInputValue('AddMovieGenreInput');
    const newMovieDescription = interaction.fields.getTextInputValue('AddMovieDescriptionInput') || '';
    let newMovieImageURL = interaction.fields.getTextInputValue('AddMovieImageInput') || '';
    let newMovieURL = interaction.fields.getTextInputValue('AddMovieURLInput') || '';

    if (!isValidHttpUrl(newMovieImageURL)) {
      newMovieImageURL = ''
    }
    if (!isValidHttpUrl(newMovieURL)) {
      newMovieURL = ''
    }

    if (!newMovieName || !newMovieGenre) {
      const noticeMessage = `Error adding movie: Missing name or genre`
      const { components, embeddedMessage } = await getMoviesOverviewPage({ interaction, noticeMessage, selectedGenre })
      return await interaction.update({
        components,
        embeds: embeddedMessage
      })
    }

    if (NON_ALLOWED_GENRES.includes(newMovieGenre)) {
      const noticeMessage = `Error adding movie: Genre value is not allowed`
      const { components, embeddedMessage } = await getMoviesOverviewPage({ interaction, noticeMessage, selectedGenre })
      return await interaction.update({
        components,
        embeds: embeddedMessage
      })
    }

    const updatedMoviesData = guildProfile.moviesData

    if (updatedMoviesData.movieList.some((movie) => {
      return movie.name.toLowerCase() === newMovieName.toLowerCase()
    })) {
      const noticeMessage = `Movie: "${newMovieName}" has already been added`
      const { components, embeddedMessage } = await getMoviesOverviewPage({ interaction, noticeMessage, selectedGenre })
      return await interaction.update({
        components,
        embeds: embeddedMessage
      })
    } else {
      updatedMoviesData.movieList.push({
        name: newMovieName,
        genre: newMovieGenre,
        description: newMovieDescription || '',
        imageURL: newMovieImageURL || '',
        isMovieWatched: false,
        movieURL: newMovieURL || ''
      })

      if (!updatedMoviesData.genreList.some((genre) => {
        return genre.toLowerCase() === newMovieGenre.toLowerCase()
      })) {
        updatedMoviesData.genreList.push(newMovieGenre)
      }

      await Guild.updateOne(
        { _id: guildProfile._id },
        { $set: { moviesData: updatedMoviesData } }
      )
    }

    const noticeMessage = `Movie: "${newMovieName}" has been added`
    const { components, embeddedMessage } = await getMoviesOverviewPage({ interaction, noticeMessage, selectedGenre })

    await interaction.update({
      components,
      embeds: embeddedMessage
    })
  },

  async editMovieModalSubmit(data) {
    const { interaction, oldMovieName = '' } = { ...data }
    const guildId = interaction.guild.id;
    let guildProfile = await Guild.findOne({ guildId: guildId });
    if (!guildProfile) {
      const noticeMessage = `Error adding movie`
      const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, noticeMessage, oldMovieName })
      return await interaction.update({
        components,
        embeds: embeddedMessage
      })
    }

    const newMovieName = interaction.fields.getTextInputValue('EditMovieNameInput');
    const newMovieGenre = interaction.fields.getTextInputValue('EditMovieGenreInput');
    const newMovieDescription = interaction.fields.getTextInputValue('EditMovieDescriptionInput');
    let newMovieImageURL = interaction.fields.getTextInputValue('EditMovieImageInput');
    let newMovieURL = interaction.fields.getTextInputValue('EditMovieURLInput');

    if (!isValidHttpUrl(newMovieImageURL)) {
      newMovieImageURL = ''
    }
    if (!isValidHttpUrl(newMovieURL)) {
      newMovieURL = ''
    }

    if (!newMovieName || !newMovieGenre) {
      const noticeMessage = `Error adding movie: Missing name or genre`
      const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, noticeMessage, oldMovieName })
      return await interaction.update({
        components,
        embeds: embeddedMessage
      })
    }

    if (NON_ALLOWED_GENRES.includes(newMovieGenre)) {
      const noticeMessage = `Error adding movie: Genre value is not allowed`
      const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, noticeMessage, oldMovieName })
      return await interaction.update({
        components,
        embeds: embeddedMessage
      })
    }

    const updatedMoviesData = guildProfile.moviesData
    const movieList = updatedMoviesData.movieList || []
    const movieDetails = movieList.find((movie) => {
      return movie.name === oldMovieName
    })

    movieDetails.name = newMovieName
    movieDetails.genre = newMovieGenre
    movieDetails.description = newMovieDescription || ''
    movieDetails.imageURL = newMovieImageURL || ''
    movieDetails.movieURL = newMovieURL || ''

    if (!updatedMoviesData.genreList.some((genre) => {
      return genre.toLowerCase() === newMovieGenre.toLowerCase()
    })) {
      updatedMoviesData.genreList.push(newMovieGenre)
    }

    await Guild.updateOne(
      { _id: guildProfile._id },
      { $set: { moviesData: updatedMoviesData } }
    )

    const noticeMessage = `Movie: "${newMovieName}" has been updated`
    const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, noticeMessage, movieName: newMovieName, selectedGenre: newMovieGenre })

    await interaction.update({
      components,
      embeds: embeddedMessage
    })
  }
}