const { createEmbedMessage } = require('../Utils/discordEmbedUtils.js')
const Guild = require("../Schemas/guild");
const mongoose = require("mongoose");
const constants = require('../Utils/constants')

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
          "custom_id": `EditMovieButton_${movieDetails.name}`,
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
          "custom_id": `ToggleMovieWatched_${movieDetails.name}_${isMovieWatched}`,
          "disabled": false,
          "type": 2
        }
      ]
    },
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
    const { interaction, selectedGenre = '', movieName = '', noticeMessage = '' } = { ...data }
    const guild = interaction.guild
    const guildId = guild.id
    let guildProfile = await Guild.findOne({ guildId: guildId });

    const moviesData = guildProfile.moviesData
    const movieList = moviesData.movieList || []

    let movieDetails = {}
    if (movieName) {
      movieDetails = movieList.find((movie) => {
        return movie.name === movieName
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
    const embedColor = '0xabffcd'
    const embedFooter = noticeMessage || '\u200b'
    const embedImage = movieDetails.imageURL || null
    const fields = getMovieListFields(movieDetails)
    const messageTitle = 'Bradán Feasa - Movies'
    let messageDescription = `${movieDetails.description}\n${movieDetails.movieURL}\n`
    // let files = null
    // const embedThumbnail = movieDetails.imageURL || "attachment://fish_popcorn.png"
    const embedThumbnail = movieDetails.imageURL || constants.MOVIES_DEFAULT_THUMBNAIL
    // if (!movieDetails.imageURL) {
    //   files = [{
    //     attachment: './src/LocalImages/fish_popcorn.png',
    //     name: 'fish_popcorn.png'
    //   }]
    // }

    const embeddedMessage = createEmbedMessage({ embedColor, embedFooter, embedImage, embedThumbnail, fields, messageDescription, messageTitle })
    return { components, embeddedMessage }
  }
}