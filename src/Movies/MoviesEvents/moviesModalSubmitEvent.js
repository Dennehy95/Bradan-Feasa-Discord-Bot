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

    let newMovieName = interaction.fields.getTextInputValue('AddMovieNameInput');
    let newMovieGenre = interaction.fields.getTextInputValue('AddMovieGenreInput');
    let newMovieDescription = interaction.fields.getTextInputValue('AddMovieDescriptionInput') || '';
    let newMovieImageURL = interaction.fields.getTextInputValue('AddMovieImageInput') || '';
    let newMovieURL = interaction.fields.getTextInputValue('AddMovieURLInput') || '';

    newMovieName = newMovieName.trim();
    newMovieGenre = newMovieGenre.trim();
    newMovieDescription = newMovieDescription.trim();
    newMovieImageURL = newMovieImageURL.trim();
    newMovieURL = newMovieURL.trim();

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
    const { interaction, movieId = '' } = { ...data }
    const guildId = interaction.guild.id;
    let guildProfile = await Guild.findOne({ guildId: guildId });
    if (!guildProfile) {
      const noticeMessage = `Error updating movie`
      const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, noticeMessage, movieId })
      return await interaction.update({
        components,
        embeds: embeddedMessage
      })
    }

    let newMovieName = interaction.fields.getTextInputValue('EditMovieNameInput');
    let newMovieGenre = interaction.fields.getTextInputValue('EditMovieGenreInput');
    let newMovieDescription = interaction.fields.getTextInputValue('EditMovieDescriptionInput');
    let newMovieImageURL = interaction.fields.getTextInputValue('EditMovieImageInput');
    let newMovieURL = interaction.fields.getTextInputValue('EditMovieURLInput');

    newMovieName = newMovieName.trim();
    newMovieGenre = newMovieGenre.trim();
    newMovieDescription = newMovieDescription.trim();
    newMovieImageURL = newMovieImageURL.trim();
    newMovieURL = newMovieURL.trim();

    if (!isValidHttpUrl(newMovieImageURL)) {
      newMovieImageURL = ''
    }
    if (!isValidHttpUrl(newMovieURL)) {
      newMovieURL = ''
    }

    if (!newMovieName || !newMovieGenre) {
      const noticeMessage = `Error adding movie: Missing name or genre`
      const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, noticeMessage, movieId })
      return await interaction.update({
        components,
        embeds: embeddedMessage
      })
    }

    if (NON_ALLOWED_GENRES.includes(newMovieGenre)) {
      const noticeMessage = `Error adding movie: Genre value is not allowed`
      const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, noticeMessage, movieId })
      return await interaction.update({
        components,
        embeds: embeddedMessage
      })
    }

    const updatedMoviesData = guildProfile.moviesData
    const movieList = updatedMoviesData.movieList || []
    const movieDetails = movieList.find((movie) => {
      return movie._id === movieId
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
    const { components, embeddedMessage } = await getMoviesMoviePage({ interaction, noticeMessage, movieId, selectedGenre: newMovieGenre })

    await interaction.update({
      components,
      embeds: embeddedMessage
    })
  }
}