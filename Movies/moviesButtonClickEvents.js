import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';

export const addMovieButtonClicked = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId('AddMovieModalSubmit')
    .setTitle('Add Movie')
    .addComponents([
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('AddMovieNameInput')
          .setLabel('Movie Name')
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(40)
          .setPlaceholder('Movie Name')
          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('AddMovieGenreInput')
          .setLabel('Genre')
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(25)
          .setPlaceholder('Movie Genre')
          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('AddMovieURLInput')
          .setLabel('IMBD, Wikipedia or Rotten Tomatoes URL')
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(25)
          .setPlaceholder('URL')
          .setRequired(false),
      ),
    ]);

  await interaction.showModal(modal);
}