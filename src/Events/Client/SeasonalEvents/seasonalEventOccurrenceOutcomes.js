const Guild = require('../../../Schemas/guild');
const {
  easterEvilBunnyHuntOccurrenceOutcomes,
} = require('./Easter/EasterEvilBunny/EvilBunnyOccurrences/easterEvilBunnyHuntOccurrenceOutcomes');
const { dateDiffInMS } = require('./utils');
// const { triggerBunnyAmbushOutcome } = require('./SeasonalEvents/ bunnyAmbushOutcome');
// const { triggerHuntingPartyOutcome } = require('./huntingPartyOutcome');

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
  async seasonalEventOccurrenceOutcomes({
    buttonClickInfo = {
      actionId: null,
      interaction: null,
      messageCreatedTimestamp: null,
      occurrenceIndex: null,
      userId: null,
    },
    eventChannel,
    eventName,
    guildId,
    updatedEventData,
  }) {
    let guildProfile = await Guild.findOne({ guildId });
    const {
      actionId = null,
      interaction,
      messageCreatedTimestamp,
      occurrenceIndex,
      userId,
    } = { ...buttonClickInfo };
    if (!updatedEventData) {
      updatedEventData = guildProfile.easterHunt;
    }
    console.log(actionId);
    if (actionId != null) {
      console.log(occurrenceIndex);
      console.log(updatedEventData.currentOccurrenceIndex);
      console.log(messageCreatedTimestamp);
      console.log(updatedEventData.eventStartTime);
      if (
        occurrenceIndex !== updatedEventData.currentOccurrenceIndex ||
        dateDiffInMS(messageCreatedTimestamp, updatedEventData.eventStartTime) >
          0
      ) {
        await interaction.reply({
          content: 'You cannot interact with this event as it is an old event',
          ephemeral: true,
        });
        return updatedEventData;
      }
      const isUserSelected =
        updatedEventData.currentOccurrence.selectedParticipants.find(
          (selectedParticipant) => selectedParticipant.userId === userId
        );
      if (!isUserSelected) {
        await interaction.reply({
          content:
            'You cannot interact with this event as you are not involved in it',
          ephemeral: true,
        });
        return updatedEventData;
      }
    }

    const occurrenceAction = updatedEventData.currentOccurrence.actions.find(
      (occurrenceAction) => occurrenceAction.id === actionId
    );
    const EventOutcomeData = {
      actionTaken: buttonClickInfo,
      eventChannel,
      Guild,
      guildId,
      guildProfile,
      occurrenceAction,
      updatedEventData,
    };
    switch (eventName) {
      case 'easterHuntAction':
        updatedEventData = await easterEvilBunnyHuntOccurrenceOutcomes(
          EventOutcomeData
        );
        break;
      case 'easterEggHuntAction':
        // updatedEventData = await easterEvilBunnyHuntOccurrenceOutcomes(EventOutcomeData);
        break;
      default:
        console.log('No event name found');
    }

    updatedEventData.currentOccurrenceIndex += 1;
    updatedEventData.currentOccurrenceEndDate = null;
    await Guild.updateOne(
      { _id: guildProfile._id },
      { $set: { easterHunt: updatedEventData } }
    );
    return updatedEventData;
  },
};
