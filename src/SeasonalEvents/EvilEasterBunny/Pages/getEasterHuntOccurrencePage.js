const Guild = require('../../../Schemas/guild');
const { createEmbedMessage } = require('../../../Utils/discordEmbedUtils');

const getComponentsEasterHuntOccurrencePage = ({
  currentOccurrence,
  currentOccurrenceIndex,
}) => {
  let componentsContainer;
  if (currentOccurrence?.actions?.length > 0) {
    componentsContainer = [];
    const actionChunks = [];
    for (let i = 0; i < currentOccurrence.actions.length && i < 25; i += 5) {
      const chunk = currentOccurrence.actions.slice(i, i + 5);
      actionChunks.push(chunk);
    }
    componentsContainer = actionChunks.map((chunk) => {
      return {
        type: 1,
        components: chunk.map((action) => {
          return {
            custom_id: `easterHuntAction_${currentOccurrenceIndex}_${action.id}`,
            disabled: false,
            label: action.label,
            style: 1,
            type: 2,
          };
        }),
      };
    });
  }
  return componentsContainer;
};

module.exports = {
  async getEasterHuntOccurrencePage({
    currentOccurrence,
    currentOccurrenceIndex,
    guildId,
  }) {
    let guildProfile = await Guild.findOne({ guildId: guildId });
    if (!guildProfile) return;

    const components = getComponentsEasterHuntOccurrencePage({
      currentOccurrence,
      currentOccurrenceIndex,
    });
    const embedColor = '#1ABC9C';
    const messageTitle = currentOccurrence.messageTitle;
    let messageDescription = currentOccurrence.messageDescription || '';
    guildProfile.easterHunt?.participants.forEach((participant) => {
      const status = participant.isAlive ? 'Alive' : 'Dead';
      messageDescription += `\n<@${participant.userId}>`;
    });

    const embeddedMessage = createEmbedMessage({
      embedColor,
      messageDescription,
      messageTitle,
    });
    return { components, embeddedMessage };
  },
};
