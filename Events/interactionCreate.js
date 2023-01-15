import { Events } from 'discord.js';
import { addMovieButtonClicked } from '../Movies/moviesButtonClickEvents.js'
import { AddMovieModalSubmit } from '../Movies/moviesModalSubmitEvent.js'

export const name = Events.InteractionCreate
export const execute = async (interaction) => {
  if (interaction.isButton()) {
    return buttonClickedEvent(interaction)
  }

  if (interaction.isModalSubmit()) {
    return modalSubmitEvent(interaction)
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

const buttonClickedEvent = async (interaction) => {
  if (interaction.customId === 'AddMovieButton') {
    // https://discordjs.guide/interactions/modals.html#the-interactioncreate-event
    return addMovieButtonClicked(interaction)
  }
}

const modalSubmitEvent = async (interaction) => {
  if (interaction.customId === 'AddMovieModalSubmit') {
    return AddMovieModalSubmit(interaction)
  }
}