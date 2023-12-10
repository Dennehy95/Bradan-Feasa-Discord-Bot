const Guild = require('../../../Schemas/guild');
const { createEmbedMessage } = require('../../../Utils/discordEmbedUtils');
const { generateNewGuildDBEntry } = require('../../../Utils/discordGuildUtils');

const getComponentsEasterHuntOverviewPage = () => {
  let components = [
    {
      type: 1,
      components: [
        {
          custom_id: `EventJoin_easterHunt`,
          disabled: false,
          label: `Enlist`,
          style: 1,
          type: 2,
        },
        {
          custom_id: `EventLeave_easterHunt`,
          disabled: false,
          label: `Abandon`,
          style: 4,
          type: 2,
        },
      ],
    },
  ];
  return components;
};

module.exports = {
  async getEasterHuntOverviewPage(data = { guildId: '', interaction: null }) {
    const { guildId, interaction } = { ...data };
    let guildProfile = await Guild.findOne({ guildId: guildId });
    if (!guildProfile) {
      guildProfile = await generateNewGuildDBEntry(interaction.guild);

      await guildProfile.save().catch(console.error);
    }

    const components = getComponentsEasterHuntOverviewPage();
    const embedColor = '#1ABC9C';
    const messageTitle = "Bradán Feasa - Easter 'Evil Bunny' Hunt";

    let messageDescription = `The King has received troubling news. The Evil Easter Bunny has escaped and is wreaking havoc upon the land. He is looking for volunteers to enlist to fight against the Evil Bunny. It will be dangerous, but we must stop it before it kills us all! You have ${guildProfile.easterHunt?.eventStartTimeText} to decide if you will join the fight!\n
    Volunteers`;

    const fields = [];
    guildProfile.easterHunt?.participants.forEach((participant) =>
      fields.push({ name: participant.username, value: ' ' })
    );

    const embeddedMessage = createEmbedMessage({
      embedColor,
      fields,
      messageDescription,
      messageTitle,
    });
    return { components, embeddedMessage };
  },
};
