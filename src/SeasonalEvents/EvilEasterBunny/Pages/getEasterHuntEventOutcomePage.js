const Guild = require('../../../Schemas/guild');
const { createEmbedMessage } = require('../../../Utils/discordEmbedUtils');
const { generateNewGuildDBEntry } = require('../../../Utils/discordGuildUtils');

const getComponentsEasterHuntEventOutcomePage = () => {
  let components = [];
  return components;
};

module.exports = {
  async getEasterHuntEventOutcomePage({
    guildId,
    occurrenceDescription,
    occurrenceTitle = '',
    eventData,
  }) {
    let guildProfile = await Guild.findOne({ guildId });
    if (!guildProfile) {
      const guildProfile = await generateNewGuildDBEntry(Guild);

      await guildProfile.save().catch(console.error);
    }
    const updatedEventData = eventData || guildProfile.easterHunt;

    const components = getComponentsEasterHuntEventOutcomePage();
    const embedColor = '#1ABC9C';
    const messageTitle = occurrenceTitle || 'Bradán Feasa - Easter Evil Bunny';

    let messageDescription = occurrenceDescription || 'Easter Evil Bunny';
    // TODO
    // If no one, end event
    updatedEventData?.participants.forEach((participant) => {
      console.log(participant);
      const status = participant.isAlive ? 'Alive' : 'Dead';
      messageDescription += `\n ${participant.username} - ${status}`;
    });

    const embeddedMessage = createEmbedMessage({
      embedColor,
      messageDescription,
      messageTitle,
    });
    return { components, embeddedMessage };
  },
};
