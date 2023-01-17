const { Events } = require('discord.js');
const { addMovieButtonClicked, getRandomMovieButtonClicked, getSpecificMovieButtonClicked } = require('../../Movies/MoviesEvents/moviesButtonClickEvents')
const { addMovieModalSubmit } = require('../../Movies/MoviesEvents/moviesModalSubmitEvent.js')
const { genreSelectMenuClicked } = require('../../Movies/MoviesEvents/moviesStringSelectMenuEvent.js')
const { getMoviesOverviewPage } = require('../../Movies/moviesOverviewPage.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute (interaction, database) {
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
      await command.execute(interaction, database);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  }
}

const buttonClickedEvent = async (interaction) => {
  if (interaction.customId.startsWith('AddMovieButton')) {
    const selectedGenre = interaction.customId.split('_')[1]
    // https://discordjs.guide/interactions/modals.html#the-interactioncreate-event
    return addMovieButtonClicked({ interaction, selectedGenre })
  }
  if (interaction.customId.startsWith('GetRandomMovie')) {
    const selectedGenre = interaction.customId.split('_')[1]
    // https://discordjs.guide/interactions/modals.html#the-interactioncreate-event
    return getRandomMovieButtonClicked({ interaction, selectedGenre })
  }
  if (interaction.customId.startsWith('GetSpecificMovie')) {
    const movieName = interaction.customId.split('_')[1]
    // https://discordjs.guide/interactions/modals.html#the-interactioncreate-event
    return getSpecificMovieButtonClicked({ interaction, movieName })
  }
  if (interaction.customId.startsWith('HomeMovieButton')) {
    const selectedGenre = interaction.customId.split('_')[1]
    const { components, embeddedMessage } = await getMoviesOverviewPage({ interaction, selectedGenre })

    await interaction.update({
      components,
      embeds: embeddedMessage
    })
  }
}

const modalSubmitEvent = async (interaction) => {
  if (interaction.customId.startsWith('AddMovieModalSubmit')) {
    const selectedGenre = interaction.customId.split('_')[1]
    return addMovieModalSubmit({ interaction, selectedGenre })
  }
}

const stringSelectMenuEvent = async (interaction) => {
  if (interaction.customId === 'SelectGenreMenu') {
    return genreSelectMenuClicked(interaction)
  }
}