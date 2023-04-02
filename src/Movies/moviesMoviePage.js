const { createEmbedMessage } = require('../Utils/discordEmbedUtils.js')
const Guild = require("../Schemas/guild");
const mongoose = require("mongoose");
const constants = require('../Utils/constants')
const { getMoviesOverviewPage } = require('./moviesOverviewPage.js');

const getComponentsMoviesMoviePage = (movieDetails, selectedGenre) => {
  const isMovieWatched = movieDetails.isMovieWatched
  const isMovieWatchedEmoji = isMovieWatched === 'true' ? '✅' : '✖️';
  const isMovieWatchedStyle = isMovieWatched === 'true' ? 3 : 4;
  const isMovieWatchedText = isMovieWatched === 'true' ? 'Watched' : 'Not Watched';
  const genreForRandom = selectedGenre ? selectedGenre : movieDetails.genre

  let components = [
    {
      "type": 1,
      "components": [
        {
          "style": 1,
          "label": `Home`,
          "custom_id": `HomeMovieButton_${selectedGenre}`,
          "disabled": false,
          "type": 2
        },
        {
          "style": 1,
          "label": `Edit Movie Details`,
          "custom_id": `EditMovieButton_${movieDetails._id}`,
          "disabled": false,
          "type": 2
        },
        {
          "style": 1,
          "label": `Random Movie`,
          "custom_id": `GetRandomMovie_`,
          "disabled": false,
          "type": 2
        },
        {
          "style": 1,
          "label": `Random ${genreForRandom} Movie`,
          "custom_id": `GetRandomMovie_${genreForRandom}`,
          "disabled": false,
          "type": 2
        },
        {
          "style": isMovieWatchedStyle,
          "emoji": isMovieWatchedEmoji,
          "label": isMovieWatchedText,
          "custom_id": `ToggleMovieWatched_${movieDetails._id}_${isMovieWatched}`,
          "disabled": false,
          "type": 2
        }
      ]
    },
    // {
    //   "type": 1,
    //   "components": [
    //     {
    //       "style": 4,
    //       "label": `Delete Movie`,
    //       "custom_id": `DeleteMovie_${movieDetails._id}_${selectedGenre}`,
    //       "disabled": false,
    //       "type": 2
    //     },
    //   ]
    // },
  ]

  return components
}

const getMovieListFields = (movieDetails) => {
  return {
    name: `Name: ${movieDetails.name}`,
    value: `Genre: ${movieDetails.genre}`
  }
}

module.exports = {
  async getMoviesMoviePage (data) {
    const { interaction, selectedGenre = '', movieId = '', noticeMessage = '' } = { ...data }
    const guild = interaction.guild
    const guildId = guild.id
    let guildProfile = await Guild.findOne({ guildId: guildId });

    const moviesData = guildProfile.moviesData
    const movieList = moviesData.movieList || []

    if (movieList.length === 0) {
      const { components, embeddedMessage } = await getMoviesOverviewPage({ interaction })
      return { components, embeddedMessage }
    }

    let movieDetails = {}
    if (movieId) {
      movieDetails = movieList.find((movie) => {
        return movie._id === movieId
      })
    } else if (selectedGenre) {
      const filteredMovieList = movieList.filter((movie) => {
        return movie.genre === selectedGenre
      })
      const random = Math.floor(Math.random() * filteredMovieList.length);
      movieDetails = filteredMovieList[random]
    } else {
      const random = Math.floor(Math.random() * movieList.length);
      movieDetails = movieList[random]
    }

    const components = getComponentsMoviesMoviePage(movieDetails, selectedGenre)
    const embedColor = '#E91E63'
    const embedFooter = noticeMessage || '\u200b'
    const embedImage = movieDetails.imageURL || null
    const fields = getMovieListFields(movieDetails)
    const messageTitle = 'Bradán Feasa - Movies'

    let messageDescription = null
    if (movieDetails.description || movieDetails.movieURL) messageDescription = `${movieDetails.description}\n${movieDetails.movieURL}\n`
    const embedThumbnail = movieDetails.imageURL || constants.MOVIES_DEFAULT_THUMBNAIL

    const embeddedMessage = createEmbedMessage({ embedColor, embedFooter, embedImage, embedThumbnail, fields, messageDescription, messageTitle })
    return { components, embeddedMessage }
  }
}