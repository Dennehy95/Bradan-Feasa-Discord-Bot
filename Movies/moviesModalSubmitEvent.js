export const AddMovieModalSubmit = async (interaction) => {
  const response =
    interaction.fields.getTextInputValue('AddMovieNameInput');
  interaction.reply(`Movie: "${response}" has been added`);
}