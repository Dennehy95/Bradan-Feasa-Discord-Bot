
const triggerBunnyAmbushOutcome = async ({ action, eventChannel, participantIds }) => {

  const { embeddedMessage } = await getEasterHuntEventOutcomePage({ guildId: server.id })
  await eventChannel.send({
    ephemeral: false,
    embeds: embeddedMessage
  });
}

/**
 * Hunting Party
 * 
 * 2-4 Participants get the chance to answer. They can either hunt the bunny or hide.
 * If they hunt, each one gets a 1/8 chance to hurt the bunny (The chance will probably be dynamic later. Same with Bunny health and players may have stat boosts and stuff) 
 * They also have a chance to be killed by Bunny. Many can die, many can hurt. If Bunny hits 0 that person gets the kill
 */
const triggerHuntingPartyOutcome = async ({ action, eventChannel, participantIds }) => {
  if (action.name === 'goHunt') {

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
  async easterEvilBunnyHuntOccurrenceOutcomes ({ action, eventChannel, updatedEventData }) {
    // TODO selectedParticipants instead
    const { eventName, participants } = { ...updatedEventData }

    switch (eventName) {
      case 'Bunny Ambush':
        await triggerBunnyAmbushOutcome({ action, eventChannel, participants })
        break;
      case 'Hunting Party':
        await triggerHuntingPartyOutcome({ action, eventChannel, participants })
        break;
      default:
        console.log('No event name found')
    }

    updatedEventData.currentOccurrenceIndex += 1
    updatedEventData.currentOccurrenceEndDate = null
    return updatedEventData
  }
}