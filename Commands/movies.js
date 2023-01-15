import { SlashCommandBuilder } from 'discord.js';
import { getMoviesOverviewPage } from '../Movies/moviesOverviewPage.js';

export const data = new SlashCommandBuilder()
  .setName('movies')
  .setDescription('Movie Lists')

export const execute = async (interaction) => {
  let isEphemeral = false
  // if (interaction.options?._hoistedOptions.length) {
  //   isEphemeral = interaction.options?._hoistedOptions.find(option => option.name === 'hide').value
  // }

  console.log(interaction)

  const { components } = await getMoviesOverviewPage(interaction.guild)
  const selectedGenre = 'All Genres'
  const title = 'Bradán Feasa - Movies - Selected Genre: ' + selectedGenre
  await interaction.reply({
    components,
    ephemeral: isEphemeral,
    embeds: [
      {
        "color": 0xabffcd,
        "description": "",
        "title": title,
        "type": "rich"
      }
    ]
  })
}