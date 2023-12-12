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
 * Possible Seasonal Event
 *
 * easterHuntAction - An events where participants fight to kill an evil Easter Bunny
 *
 * easterEggHuntAction - An events where participants collect random appearing eggs in the server
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
    if (actionId != null) {
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
        console.info('No event name found');
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
