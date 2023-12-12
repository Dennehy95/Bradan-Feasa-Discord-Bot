const Guild = require('../../../../../../Schemas/guild');
const {
  triggerBunnyAmbushOutcome,
} = require('./BunnyAmbush/bunnyAmbushOutcome');
const {
  triggerHuntingPartyOutcome,
} = require('./HuntingParty/huntingPartyOutcome');

/**
 * The action should have - [Id of user who did action, the action name]. If empty, there was no response and we do default result
 *
 * Possible Events
 *
 * Ambush - Actions: [], 1-4 Participants, All attacked
 *
 * TODO Protective Ambush - Actions: [Protect [other person], Run Away], 2 Participants, First one to answer does it. Run away other dies, Protect 50/50 you die
 *
 * HuntingParty - Actions: [Go on a Hunt, Hide, Tricker Other Hunters], 2-4 Possible Participants
 *
 * TODO InterruptedSleep - Actions: [Investigate, Ignore It, Sound The Alarm], 1 Participant
 *
 */
module.exports = {
  // buttonClickInfo: { actionId, messageCreatedTimestamp, interaction, occurrenceIndex, userId }
  async easterEvilBunnyHuntOccurrenceOutcomes(eventOutcomeData) {
    let updatedEventData = eventOutcomeData.updatedEventData;

    switch (updatedEventData.currentOccurrence.occurrenceName) {
      case 'ambush':
        updatedEventData = await triggerBunnyAmbushOutcome(eventOutcomeData);
        break;
      case 'protectiveAmbush':
        // updatedEventData = await triggerBunnyProtectiveAmbushOutcome(eventOutcomeData);
        break;
      case 'huntingParty':
        updatedEventData = await triggerHuntingPartyOutcome(eventOutcomeData);
        break;
      case 'interruptedSleep':
        // updatedEventData = await triggerInterruptedSleepOutcome(eventOutcomeData);
        break;
      default:
        console.info('No event name found');
    }

    return updatedEventData;
  },
};
