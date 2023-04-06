
const Guild = require('../../../../Schemas/guild');

const triggerBunnyAmbushOutcome = async ({ action, eventChannel, selectedParticipants }) => {

  const { embeddedMessage } = await getEasterHuntEventOutcomePage({ guildId: server.id })
  await eventChannel.send({
    ephemeral: false,
    embeds: embeddedMessage
  });
}

/**
 * Hunting Party
 * 
 * 2-4 Participants get the chance to answer. They can either hunt the bunny or hide or one member can trick the others into going without them.
 * If they hunt, each one gets a 1/8 chance to hurt the bunny (The chance will probably be dynamic later. Same with Bunny health and players may have stat boosts and stuff) 
 * They also have a chance to be killed by Bunny. Many can die, many can hurt. If Bunny hits 0 that person gets the kill
 */
const triggerHuntingPartyOutcome = async ({ action, eventChannel, selectedParticipants }) => {
  switch (action?.name) {
    case 'goOnHunt':
      console.log(selectedParticipants)
      // Roll once. If successful the party find the bunny, if minor fail they don't find anything and go home, if major fail they are ambushed
      // If FIND BUNNY, Roll for each participant. Do a damage - Forced to retreat - Get killed
      // If Ambushed - Roll for each - Retreat - Get Kileld
      break;
    case 'hide':
      console.log('hiding')
      // Roll once. If successful the party hide and nothing happens, if major fail they are caught and one of them risks being exiled
      break;
    case 'trickOtherHunters':
      console.log('tricking')
      // The user gets to hide successfully. The others go on the hunt as in the first action
      break;
    default:
      console.log('No action taken')
    // Either you feel asleep, or you forgot to go on hunt
    // Random chance, either King chastises the group and nothing happens, or one member is exiled from the city and Eaten by the Bunny

  }
  const { embeddedMessage } = await getEasterHuntEventOutcomePage({ guildId: server.id })
  await eventChannel.send({
    ephemeral: false,
    embeds: embeddedMessage
  });
}

/**
 * The action should have - [Id of user who did action, the action name]. If empty, there was no response and we do default result
 * 
 * Possible Events
 * 
 * Bunny Ambush - Actions: [Protect [other person], Run Away], 2 Participants, First one to answer does it. Run away other dies, Protect 50/50 you die
 * 
 * Hunting Party - Actions: [Go on a Hunt, Hide], 2-4 Possible Participants
 * 
 */
module.exports = {
  // buttonClickInfo: { actionId, occurrenceIndex, userId }
  async easterEvilBunnyHuntOccurrenceOutcomes ({ buttonClickInfo, eventChannel, guildId, updatedEventData }) {
    if (!updatedEventData) {
      let guildProfile = await Guild.findOne({ guildId: guildId });
      updatedEventData = guildProfile.easterHunt;
    }
    if (buttonClickInfo) {
      if (buttonClickInfo.occurrenceIndex !== updatedEventData.currentOccurrenceIndex || dateDiffInMS(messageCreatedTimestamp, updatedEventData.eventStartTime) > 0) {
        await interaction.reply({
          content: 'You cannot interact with this event as it is an old event',
          ephemeral: true,
        })
        return updatedEventData
      }
      const isUserSelected = updatedEventData.currentOccurrence.selectedParticipants.find((selectedParticipant) => {
        return selectedParticipant.userId === buttonClickInfo.userId
      })
      if (!isUserSelected) {
        await interaction.reply({
          content: 'You cannot interact with this event as you are not involved in it',
          ephemeral: true,
        })
        return updatedEventData
      }
    }
    // We've come from a button click
    // We've come from end of event no response

    switch (updatedEventData.eventName) {
      case 'Bunny Ambush':
        await triggerBunnyAmbushOutcome({ action, eventChannel, selectedParticipants: updatedEventData.currentOccurrence.selectedParticipants })
        break;
      case 'Hunting Party':
        await triggerHuntingPartyOutcome({ action, eventChannel, selectedParticipants: updatedEventData.currentOccurrence.selectedParticipants })
        break;
      default:
        console.log('No event name found')
    }

    updatedEventData.currentOccurrenceIndex += 1
    updatedEventData.currentOccurrenceEndDate = null
    return updatedEventData
  }
}