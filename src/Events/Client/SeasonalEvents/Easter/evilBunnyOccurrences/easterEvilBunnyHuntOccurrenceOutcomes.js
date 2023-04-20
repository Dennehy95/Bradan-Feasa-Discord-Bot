
const Guild = require('../../../../../Schemas/guild');
const { dateDiffInMS } = require('../../utils');
const { triggerBunnyAmbushOutcome } = require('./bunnyAmbushOutcome');
const { triggerHuntingPartyOutcome } = require('./huntingPartyOutcome');

/**
 * The action should have - [Id of user who did action, the action name]. If empty, there was no response and we do default result
 * 
 * Possible Events
 * 
 * Ambush - Actions: [Protect [other person], Run Away], 2 Participants, First one to answer does it. Run away other dies, Protect 50/50 you die
 * 
 * HuntingParty - Actions: [Go on a Hunt, Hide], 2-4 Possible Participants
 * 
 */
module.exports = {
  // buttonClickInfo: { actionId, messageCreatedTimestamp, interaction, occurrenceIndex, userId }
  async easterEvilBunnyHuntOccurrenceOutcomes ({ buttonClickInfo, eventChannel, guildId, updatedEventData }) {
    let guildProfile = await Guild.findOne({ guildId });
    const { actionId, interaction, messageCreatedTimestamp, occurrenceIndex, userId } = { ...buttonClickInfo }
    if (!updatedEventData) {
      updatedEventData = guildProfile.easterHunt;
    }
    if (buttonClickInfo) {
      if (occurrenceIndex !== updatedEventData.currentOccurrenceIndex || dateDiffInMS(messageCreatedTimestamp, updatedEventData.eventStartTime) > 0) {
        await interaction.reply({
          content: 'You cannot interact with this event as it is an old event',
          ephemeral: true,
        })
        return updatedEventData
      }
      const isUserSelected = updatedEventData.currentOccurrence.selectedParticipants.find((selectedParticipant) => selectedParticipant.userId === userId)
      if (!isUserSelected) {
        await interaction.reply({
          content: 'You cannot interact with this event as you are not involved in it',
          ephemeral: true,
        })
        return updatedEventData
      }
    }

    const occurrenceAction = updatedEventData.currentOccurrence.actions.find((occurrenceAction) => occurrenceAction.id === actionId)

    console.log('CHOSEN EVENT NAME IS')
    console.log(updatedEventData.currentOccurrence.occurrenceName)
    switch (updatedEventData.currentOccurrence.occurrenceName) {
      case 'ambush':
        updatedEventData = await triggerBunnyAmbushOutcome({ actionTaken: buttonClickInfo, eventChannel, guildId, occurrenceAction, updatedEventData })
        break;
      case 'huntingParty':
        updatedEventData = await triggerHuntingPartyOutcome({ actionTaken: buttonClickInfo, eventChannel, guildId, occurrenceAction, updatedEventData })
        break;
      default:
        console.log('No event name found')
    }

    updatedEventData.currentOccurrenceIndex += 1
    updatedEventData.currentOccurrenceEndDate = null
    await Guild.updateOne(
      { _id: guildProfile._id },
      { $set: { easterHunt: updatedEventData } }
    );
    return updatedEventData
  }
}