const Guild = require('../../../../../../Schemas/guild');
const { dateDiffInMS } = require('../../../utils');
const { triggerBunnyAmbushOutcome } = require('./bunnyAmbushOutcome');
const {
  triggerHuntingPartyOutcome,
} = require('./HuntingParty/huntingPartyOutcome');

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
  async easterEvilBunnyHuntOccurrenceOutcomes(eventOutcomeData) {
    let updatedEventData = eventOutcomeData.updatedEventData;

    switch (updatedEventData.currentOccurrence.occurrenceName) {
      case 'ambush':
        updatedEventData = await triggerBunnyAmbushOutcome(eventOutcomeData);
        break;
      case 'huntingParty':
        updatedEventData = await triggerHuntingPartyOutcome(eventOutcomeData);
        break;
      default:
        console.log('No event name found');
    }

    return updatedEventData;
  },
};
