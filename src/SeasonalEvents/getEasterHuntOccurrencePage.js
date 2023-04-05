const Guild = require("../Schemas/guild");
const { createEmbedMessage } = require("../Utils/discordEmbedUtils");

// MAybe instead of creating a buttons et for each event, we create a schema in the DB. it stores an 
// occurrence object which has the buttons and users listed as well as the type of event and any extra permutations and things
// Then if a call with a button with the correct index is called we take the action and increment the index, no longer wait and return message
const getComponentsEasterHuntOccurrencePage = (currentOccurrenceIndex) => {
  let components = [
    {
      "type": 1,
      "components": [
        {
          "custom_id": `easterHuntAction_Hunt_${currentOccurrenceIndex}`,
          "disabled": false,
          "label": `Go on a Hunt`,
          "style": 1,
          "type": 2
        },
        {
          "custom_id": `easterHunt_Hide_${currentOccurrenceIndex}`,
          "disabled": false,
          "label": `Hide`,
          "style": 1,
          "type": 2
        },
      ]
    },
  ]
  return components
}

module.exports = {
  async getEasterHuntOccurrencePage (data) {
    const { currentOccurrence, currentOccurrenceIndex, guildId } = { ...data }
    let guildProfile = await Guild.findOne({ guildId: guildId });
    if (!guildProfile) return

    const components = getComponentsEasterHuntOccurrencePage(currentOccurrenceIndex)
    const embedColor = '#1ABC9C'
    const messageTitle = currentOccurrence.messageTitle
    let messageDescription = currentOccurrence.messageDescription
    // TODO
    // If no one, end event

    // guildProfile.easterHunt?.participants.forEach(participant => messageDescription += '\n' + '<@' + participant.id + '>')
    guildProfile.easterHunt?.participants.forEach(participant => messageDescription += '\n' + `<@${participant.userId}>`)


    const embeddedMessage = createEmbedMessage({ embedColor, messageDescription, messageTitle })
    return { components, embeddedMessage }
  }
}