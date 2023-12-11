const { Events } = require('discord.js');
const {
  addMovieButtonClicked,
  editMovieButtonClicked,
  getRandomMovieButtonClicked,
  getSpecificMovieButtonClicked,
  toggleMovieWatchedButtonClicked,
  deleteMovieButtonClicked,
} = require('../../Movies/MoviesEvents/moviesButtonClickEvents');
const {
  addMovieModalSubmit,
  editMovieModalSubmit,
} = require('../../Movies/MoviesEvents/moviesModalSubmitEvent.js');
const {
  genreSelectMenuClicked,
} = require('../../Movies/MoviesEvents/moviesStringSelectMenuEvent.js');
const { getMoviesOverviewPage } = require('../../Movies/moviesOverviewPage.js');
const {
  changeEventOnOrOffButtonClicked,
  userInvolveEventButtonClicked,
} = require('../../SeasonalEvents/SeasonalEventsButtonClicks/seasonalEventButtonClicks');
const {
  easterEvilBunnyHuntOccurrenceOutcomes,
} = require('./SeasonalEvents/Easter/EasterEvilBunny/EvilBunnyOccurrences/easterEvilBunnyHuntOccurrenceOutcomes');
const {
  seasonalEventOccurrenceOutcomes,
} = require('./SeasonalEvents/seasonalEventOccurrenceOutcomes');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isButton()) {
      return buttonClickedEvent(interaction);
    }

    if (interaction.isModalSubmit()) {
      return modalSubmitEvent(interaction);
    }

    if (interaction.isStringSelectMenu()) {
      return stringSelectMenuEvent(interaction);
    }

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  },
};

const buttonClickedEvent = async (interaction) => {
  // https://discordjs.guide/interactions/modals.html#the-interactioncreate-event
  const interactionCustomIDStartsWith = interaction.customId.split('_')[0];
  /********************* Seasonal Events **************************/
  let components, embeddedMessage, movieId, selectedEvent, selectedGenre;
  switch (interactionCustomIDStartsWith) {
    case 'EventJoin':
      selectedEvent = interaction.customId.split('_')[1];
      return userInvolveEventButtonClicked({
        interaction,
        isJoining: true,
        selectedEvent,
      });
    case 'EventLeave':
      selectedEvent = interaction.customId.split('_')[1];
      return userInvolveEventButtonClicked({
        interaction,
        isJoining: false,
        selectedEvent,
      });
    case 'StartEvent':
      selectedEvent = interaction.customId.split('_')[1];
      return changeEventOnOrOffButtonClicked({
        interaction,
        startingEvent: true,
        selectedEvent,
      });
    case 'StopEvent':
      selectedEvent = interaction.customId.split('_')[1];
      return changeEventOnOrOffButtonClicked({
        interaction,
        startingEvent: false,
        selectedEvent,
      });
    case 'easterHuntAction':
    case 'easterEggHuntAction':
      const occurrenceIndex = parseInt(interaction.customId.split('_')[1]);
      const actionId = parseInt(interaction.customId.split('_')[2]);
      return await seasonalEventOccurrenceOutcomes({
        // return await easterEvilBunnyHuntOccurrenceOutcomes({
        buttonClickInfo: {
          actionId,
          messageCreatedTimestamp: interaction.message.createdTimestamp,
          interaction,
          occurrenceIndex,
          userId: interaction.user.id,
        },
        eventName: interactionCustomIDStartsWith,
        eventChannel: interaction.channel,
        guildId: interaction.guildId,
        updatedEventData: null,
      });

    /********************* Movies **************************/
    case 'AddMovieButton':
      selectedGenre = interaction.customId.split('_')[1];
      return addMovieButtonClicked({ interaction, selectedGenre });
    case 'DeleteMovie':
      movieId = interaction.customId.split('_')[1];
      selectedGenre = interaction.customId.split('_')[2];
      return deleteMovieButtonClicked({ interaction, movieId, selectedGenre });
    case 'EditMovieButton':
      movieId = interaction.customId.split('_')[1];
      return editMovieButtonClicked({ interaction, movieId });
    case 'HomeMovieButton':
      selectedGenre = interaction.customId.split('_')[1];
      ({ components, embeddedMessage } = await getMoviesOverviewPage({
        interaction,
        selectedGenre,
      }));

      await interaction.update({
        components,
        embeds: embeddedMessage,
      });
      break;
    case 'GetRandomMovie':
      selectedGenre = interaction.customId.split('_')[1];
      return getRandomMovieButtonClicked({ interaction, selectedGenre });
    case 'GetSpecificMovie':
      movieId = interaction.customId.split('_')[1];
      return getSpecificMovieButtonClicked({ interaction, movieId });
    case 'MOPage':
      const pageNumber = interaction.customId.split('_')[1];
      selectedGenre = interaction.customId.split('_')[2];
      ({ components, embeddedMessage } = await getMoviesOverviewPage({
        interaction,
        pageNumber,
        selectedGenre,
      }));

      await interaction.update({
        components,
        embeds: embeddedMessage,
      });
      break;
    case 'ToggleMovieWatched':
      // const movieName = interaction.customId.split('_')[1]
      movieId = interaction.customId.split('_')[1];
      const isMovieWatched = interaction.customId.split('_')[2];
      return toggleMovieWatchedButtonClicked({
        interaction,
        movieId,
        isMovieWatched,
      });
    default:
      return;
  }
};

const modalSubmitEvent = async (interaction) => {
  if (interaction.customId.startsWith('AddMovieModalSubmit')) {
    const selectedGenre = interaction.customId.split('_')[1];
    return addMovieModalSubmit({ interaction, selectedGenre });
  }
  if (interaction.customId.startsWith('EditMovieModalSubmit')) {
    // const oldMovieName = interaction.customId.split('_')[1]
    const movieId = interaction.customId.split('_')[1];
    return editMovieModalSubmit({ interaction, movieId });
  }
};

const stringSelectMenuEvent = async (interaction) => {
  if (interaction.customId === 'SelectGenreMenu') {
    return genreSelectMenuClicked(interaction);
  }
};
