const Guild = require("../Schemas/guild");
const { createEmbedMessage } = require("../Utils/discordEmbedUtils");

const getComponentsEasterHuntStartedPage = () => {
  let components = []
  return components
}

module.exports = {
  async getEasterHuntStartedPage (data) {
    const { guildId } = { ...data }
    let guildProfile = await Guild.findOne({ guildId: guildId });
    if (!guildProfile) {
      guildProfile = await generateNewGuildDBEntry(guild)

      await guildProfile.save().catch(console.error);
    }

    const components = getComponentsEasterHuntStartedPage()
    const embedColor = '#1ABC9C'
    const messageTitle = "Bradán Feasa - Easter 'Evil Bunny' Hunt has Begun!"

    let messageDescription = 'The following brave souls have signed up to find the Evil Rabbit!'
    // TODO
    // If no one, end event

    guildProfile.easterHunt?.participants.forEach(participant => messageDescription += '\n' + participant.username)

    const embeddedMessage = createEmbedMessage({ embedColor, messageDescription, messageTitle })
    return { components, embeddedMessage }
  }
}