const Guild = require('../Schemas/guild');
const { createEmbedMessage } = require('../Utils/discordEmbedUtils');

const getComponentsEasterHuntEventOutcomePage = () => {
  let components = [];
  return components;
};

module.exports = {
  async getEasterHuntEventOutcomePage ({
    guildId,
    occurrenceDescription,
    occurrenceTitle
  }) {
    let guildProfile = await Guild.findOne({ guildId });
    if (!guildProfile) {
      guildProfile = await generateNewGuildDBEntry(guild);

      await guildProfile.save().catch(console.error);
    }

    const components = getComponentsEasterHuntEventOutcomePage();
    const embedColor = '#1ABC9C';
    const messageTitle = occurrenceTitle || 'Bradán Feasa - Easter Evil Bunny';

    let messageDescription = occurrenceDescription || 'Easter Evil Bunny';
    // TODO
    // If no one, end event

    guildProfile.easterHunt?.participants.forEach(
      (participant) => (messageDescription += '\n' + participant.username)
    );

    const embeddedMessage = createEmbedMessage({
      embedColor,
      messageDescription,
      messageTitle,
    });
    return { components, embeddedMessage };
  },
};
