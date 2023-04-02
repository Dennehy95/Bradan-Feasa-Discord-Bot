const { createEmbedMessage } = require('../Utils/discordEmbedUtils.js')
const Guild = require("../Schemas/guild");
const mongoose = require("mongoose");
const constants = require('../Utils/constants');
const { generateNewGuildDBEntry } = require('../Utils/discordGuildUtils.js');
const { defaultEasterHuntData } = require('../Schemas/easterHuntSchema.js');

const getComponentsManageEventsPage = () => {
  const eventActivateButton = {
    "custom_id": `StartEvent_easterHunt`,
    "disabled": false,
    "label": `Activate Easter Hunt`,
    "style": 1,
    "type": 2
  }
  const eventDeactivateButton = {
    "custom_id": `StopEvent_easterHunt`,
    "disabled": false,
    "label": `Deactivate Easter Hunt`,
    "style": 4,
    "type": 2
  }
  let components = [
    {
      "type": 1,
      "components": [
        eventActivateButton,
        eventDeactivateButton
      ]
    },
  ]
  return components
}

module.exports = {
  async getManageEventsPage (data) {
    const { interaction } = { ...data }
    const guild = interaction.guild
    const guildId = guild.id
    let guildProfile = await Guild.findOne({ guildId: guildId });
    if (!guildProfile) {
      guildProfile = await generateNewGuildDBEntry(guild)

      await guildProfile.save().catch(console.error);
    }

    //TODO
    // GENERATE ALl event sif not yet created (maybe do somewhere else...?)
    if (!guildProfile.easterHunt) {
      await Guild.updateOne(
        { _id: guildProfile._id },
        { $set: { easterHunt: defaultEasterHuntData } }
      )
      guildProfile = await Guild.findOne({ guildId: guildId });
    }
    // TODO make this get all events in future
    const eventsData = guildProfile.easterHunt
    const components = getComponentsManageEventsPage(eventsData)
    const embedColor = '#1ABC9C'
    const embedImage = null
    // const fields = getMovieListFields(moviesOnPage)
    const messageTitle = 'Bradán Feasa - Manage Events'
    let messageDescription = 'Manage events description\n' + 'Easter event is turned on? ' + eventsData.isEventTurnedOn

    const embedThumbnail = null
    const embeddedMessage = createEmbedMessage({ embedColor, embedImage, embedThumbnail, messageDescription, messageTitle })
    return { components, embeddedMessage }
  }
}