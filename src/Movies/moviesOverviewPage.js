const { createEmbedMessage } = require('../Utils/discordEmbedUtils.js')
const Guild = require("../Schemas/guild");
const mongoose = require("mongoose");
const constants = require('../Utils/constants');
const { generateNewGuildDBEntry } = require('../Utils/discordGuildUtils.js');

const getMovieButtons = (movieList) => {
  const movieButtonComponents = movieList.map((movie) => {
    return {
      "style": 3,
      "label": movie.name,
      "custom_id": `GetSpecificMovie_${movie._id}`,
      "disabled": false,
      "type": 2
    }
  })

  return {
    "type": 1,
    "components": movieButtonComponents || []
  }
}

const getMoviePageActionButtons = (updatedSelectedGenre) => {
  const moviePageActionButtons =
  {
    "type": 1,
    "components": [
      {
        "style": 1,
        "label": `Add a Movie`,
        "custom_id": `AddMovieButton_${updatedSelectedGenre}`,
        "disabled": false,
        "type": 2
      },
      {
        "style": 1,
        "label": `Random Movie`,
        "custom_id": `GetRandomMovie_`,
        "disabled": false,
        "type": 2
      }
    ]
  }
  if (updatedSelectedGenre !== 'All Genres') {
    moviePageActionButtons.components.push({
      "style": 1,
      "label": `Random ${updatedSelectedGenre} Movie`,
      "custom_id": `GetRandomMovie_${updatedSelectedGenre}`,
      "disabled": false,
      "type": 2
    }
    )
  }
  return moviePageActionButtons
}

const getComponentsMoviesOverviewPage = (data) => {
  const { genreList, movieList, pageNumber = 1, totalPages, updatedSelectedGenre } = { ...data }
  const genreOptions = genreList.map((genre) => {
    const isDefault = genre === updatedSelectedGenre
    return {
      "label": genre,
      "value": genre,
      "default": isDefault
    }
  })
  genreOptions.unshift({
    "label": `All Genres`,
    "value": `All Genres`,
    "default": !!!updatedSelectedGenre
  })

  const movieButtons = getMovieButtons(movieList)
  const moviePageActionButtons = getMoviePageActionButtons(updatedSelectedGenre)

  let components = [
    {
      "type": 1,
      "components": [
        {
          "style": 1,
          "label": `<< Previous Page`,
          "custom_id": `MOPage_${parseInt(pageNumber) - 1}_${updatedSelectedGenre}`,
          "disabled": totalPages <= 1,
          "type": 2
        },
        {
          "style": 1,
          "label": `Next Page >>`,
          "custom_id": `MOPage_${parseInt(pageNumber) + 1}_${updatedSelectedGenre}`,
          "disabled": totalPages <= 1,
          "type": 2
        }
      ]
    },
    {
      "type": 1,
      "components": [
        {
          "custom_id": `SelectGenreMenu`,
          "placeholder": `Select Genre`,
          "options": genreOptions,
          "min_values": 1,
          "max_values": 1,
          "type": 3
        }
      ]
    },
    moviePageActionButtons
  ]

  if (movieList.length > 0) {
    components.splice(2, 0, movieButtons)
  }

  return components
}

const getMovieListFields = (movieList) => {
  if (movieList.length === 0) {
    return {
      name: 'No Movies for this Genre',
      value: '\u200b'
    }
  }
  const first5OnlyForNow = movieList.slice(0, 5)
  return first5OnlyForNow.map((movie) => {
    const isMovieWatched = movie.isMovieWatched
    const isMovieWatchedText = isMovieWatched === 'true' ? '✅ Watched' : ':x: Not Watched'
    const movieDescriptionText = movie.description ? movie.description + '\n' : ''
    const movieURLText = movie.movieURL ? movie.movieURL + '\n' : ''
    return {
      name: movie.name + ' - ' + movie.genre,
      value: (
        movieDescriptionText + movieURLText + isMovieWatchedText + '\n\u200b\n')
        || '\u200b'
    }
  })
}

const getSelectedGenreFromInteraction = (interaction, genreList) => {
  const message = interaction.options?.data
  let genreSelectedInMessage = 'All Genres'
  if (message) {
    genreSelectedInMessage = interaction.findAfterSelectedGenreText
  }
  if (genreList.some((genre) => {
    return genreSelectedInMessage === genre
  })) {
    return genreSelectedInMessage
  }
  return 'All Genres'
}

module.exports = {

  async getMoviesOverviewPage (data) {
    const { interaction, pageNumber = 1, noticeMessage = '', selectedGenre } = { ...data }
    const guild = interaction.guild
    const guildId = guild.id
    let guildProfile = await Guild.findOne({ guildId: guildId });
    if (!guildProfile) {
      guildProfile = await generateNewGuildDBEntry(guild)

      await guildProfile.save().catch(console.error);
    }

    const moviesData = guildProfile.moviesData

    const genreList = moviesData.genreList || []
    const movieList = moviesData.movieList || []
    const updatedSelectedGenre = selectedGenre || getSelectedGenreFromInteraction(interaction, genreList)
    let filteredMovieList = movieList
    if (updatedSelectedGenre !== 'All Genres') {
      filteredMovieList = movieList.filter((movie) => {
        return movie.genre === selectedGenre
      })
    }

    let updatedPageNumber = parseInt(pageNumber)
    let totalPages = Math.ceil(filteredMovieList.length / 5)
    if (totalPages === 0) totalPages = 1
    if (updatedPageNumber > totalPages) updatedPageNumber = 1
    if (updatedPageNumber === 0) {
      updatedPageNumber = totalPages
    }
    const moviesListEndIndex = updatedPageNumber * 5
    const moviesOnPage = filteredMovieList.slice(moviesListEndIndex - 5, moviesListEndIndex)

    const components = getComponentsMoviesOverviewPage({ genreList, movieList: moviesOnPage, pageNumber: updatedPageNumber, totalPages, updatedSelectedGenre })
    const embedColor = '#E91E63'
    const pageNumberText = '\n\u200b\nPage ' + updatedPageNumber + ' of ' + totalPages
    const embedFooter = noticeMessage + pageNumberText || pageNumberText
    const embedImage = null
    const fields = getMovieListFields(moviesOnPage)
    const messageTitle = 'Bradán Feasa - Movies'
    let messageDescription = 'Selected Genre: ' + updatedSelectedGenre + '\n'

    // const embedThumbnail = "attachment://fish_popcorn.png"
    const embedThumbnail = constants.MOVIES_DEFAULT_THUMBNAIL
    // const files = [{
    //   attachment: './src/LocalImages/fish_popcorn.png',
    //   name: 'fish_popcorn.png'
    // }]

    const embeddedMessage = createEmbedMessage({ embedColor, embedFooter, embedImage, embedThumbnail, fields, messageDescription, messageTitle })
    return { components, embeddedMessage }
  }
}