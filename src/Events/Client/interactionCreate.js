const { Events } = require('discord.js');
const {
  addMovieButtonClicked,
  editMovieButtonClicked,
  getRandomMovieButtonClicked,
  getSpecificMovieButtonClicked,
  toggleMovieWatchedButtonClicked
} = require('../../Movies/MoviesEvents/moviesButtonClickEvents')
const { addMovieModalSubmit, editMovieModalSubmit } = require('../../Movies/MoviesEvents/moviesModalSubmitEvent.js')
const { genreSelectMenuClicked } = require('../../Movies/MoviesEvents/moviesStringSelectMenuEvent.js')
const { getMoviesOverviewPage } = require('../../Movies/moviesOverviewPage.js');
const { changeEventOnOrOffButtonClicked, userInvolveEventButtonClicked } = require('../../SeasonalEvents/SeasonalEventsButtonClicks/seasonalEventButtonClicks');
const { easterEvilBunnyHuntOccurrenceOutcomes } = require('./SeasonalEvents/Easter/evilBunnyOccurrences/easterEvilBunnyHuntOccurrenceOutcomes');

module.exports = {
  name: Events.InteractionCreate,
  async execute (interaction) {
    if (interaction.isButton()) {
      return buttonClickedEvent(interaction)
    }

    if (interaction.isModalSubmit()) {
      return modalSubmitEvent(interaction)
    }

    if (interaction.isStringSelectMenu()) {
      return stringSelectMenuEvent(interaction)
    }

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  }
}

const buttonClickedEvent = async (interaction) => {
  // https://discordjs.guide/interactions/modals.html#the-interactioncreate-event

  /********************* Seasonal Events **************************/
  if (interaction.customId.startsWith('EventJoin')) {
    const selectedEvent = interaction.customId.split('_')[1]
    return userInvolveEventButtonClicked({ interaction, isJoining: true, selectedEvent })
  }
  if (interaction.customId.startsWith('EventLeave')) {
    const selectedEvent = interaction.customId.split('_')[1]
    return userInvolveEventButtonClicked({ interaction, isJoining: false, selectedEvent })
  }
  if (interaction.customId.startsWith('StartEvent')) {
    const selectedEvent = interaction.customId.split('_')[1]
    return changeEventOnOrOffButtonClicked({ interaction, startingEvent: true, selectedEvent })
  }
  if (interaction.customId.startsWith('StopEvent')) {
    const selectedEvent = interaction.customId.split('_')[1]
    return changeEventOnOrOffButtonClicked({ interaction, startingEvent: false, selectedEvent })
  }

  if (interaction.customId.startsWith('easterHuntAction')) {
    const occurrenceIndex = parseInt(interaction.customId.split('_')[1])
    const actionId = parseInt(interaction.customId.split('_')[2])
    return easterEvilBunnyHuntOccurrenceOutcomes({ buttonClickInfo: { actionId, messageCreatedTimestamp: interaction.message.createdTimestamp, interaction, occurrenceIndex, userId: interaction.user.id }, eventChannel: interaction.channel, guildId: interaction.guildId })
  }

  /********************* Movies **************************/
  if (interaction.customId.startsWith('AddMovieButton')) {
    const selectedGenre = interaction.customId.split('_')[1]
    return addMovieButtonClicked({ interaction, selectedGenre })
  }
  if (interaction.customId.startsWith('DeleteMovie')) {
    const movieId = interaction.customId.split('_')[1]
    const selectedGenre = interaction.customId.split('_')[2]
    return deleteMovieButtonClicked({ interaction, movieId, selectedGenre })
  }
  if (interaction.customId.startsWith('EditMovieButton')) {
    const movieId = interaction.customId.split('_')[1]
    return editMovieButtonClicked({ interaction, movieId })
  }
  if (interaction.customId.startsWith('HomeMovieButton')) {
    const selectedGenre = interaction.customId.split('_')[1]
    const { components, embeddedMessage } = await getMoviesOverviewPage({ interaction, selectedGenre })

    await interaction.update({
      components,
      embeds: embeddedMessage
    })
  }
  if (interaction.customId.startsWith('GetRandomMovie')) {
    const selectedGenre = interaction.customId.split('_')[1]
    return getRandomMovieButtonClicked({ interaction, selectedGenre })
  }
  if (interaction.customId.startsWith('GetSpecificMovie')) {
    const movieId = interaction.customId.split('_')[1]
    return getSpecificMovieButtonClicked({ interaction, movieId })
  }
  if (interaction.customId.startsWith('MOPage_')) {
    const pageNumber = interaction.customId.split('_')[1]
    const selectedGenre = interaction.customId.split('_')[2]
    const { components, embeddedMessage } = await getMoviesOverviewPage({ interaction, pageNumber, selectedGenre })

    await interaction.update({
      components,
      embeds: embeddedMessage
    })
  }
  if (interaction.customId.startsWith('ToggleMovieWatched')) {
    // const movieName = interaction.customId.split('_')[1]
    const movieId = interaction.customId.split('_')[1]
    const isMovieWatched = interaction.customId.split('_')[2]
    return toggleMovieWatchedButtonClicked({ interaction, movieId, isMovieWatched })
  }
}

const modalSubmitEvent = async (interaction) => {
  if (interaction.customId.startsWith('AddMovieModalSubmit')) {
    const selectedGenre = interaction.customId.split('_')[1]
    return addMovieModalSubmit({ interaction, selectedGenre })
  }
  if (interaction.customId.startsWith('EditMovieModalSubmit')) {
    // const oldMovieName = interaction.customId.split('_')[1]
    const movieId = interaction.customId.split('_')[1]
    return editMovieModalSubmit({ interaction, movieId })
  }
}

const stringSelectMenuEvent = async (interaction) => {
  if (interaction.customId === 'SelectGenreMenu') {
    return genreSelectMenuClicked(interaction)
  }
}