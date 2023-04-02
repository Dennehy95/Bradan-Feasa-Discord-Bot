const { SlashCommandBuilder } = require('discord.js');
const { getManageEventsOverviewPage, getManageEventsPage } = require('../SeasonalEvents/manageEventsPage.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('manage_events')
    .setDescription('Activate/Deactivate scheduled seasonal and server events'),

  async execute (interaction) {
    const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');
    if (!isAdmin) {
      interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
    }

    const { components, embeddedMessage } = await getManageEventsPage({ interaction })

    await interaction.reply({
      components,
      ephemeral: true,
      embeds: embeddedMessage
    })
  }
}
