const {
  getEasterHuntEventOutcomePage,
} = require('../../../../../../../SeasonalEvents/EvilEasterBunny/Pages/getEasterHuntEventOutcomePage');
const {
  allParticipantsKilled,
  sendEventOutcomeMessage,
} = require('../../easterEvilBunnyHuntUtils');
const { simulateAmbushEvent } = require('./bunnyAmbushActions');

//TODO later this should just ping the event role, we create and delete the role as needed
const generateInitialOccurrenceDescription = async function ({
  selectedParticipants,
}) {
  const participantNames = selectedParticipants.map(
    (participant) => `<@${participant.userId}>`
  );
  // Discord has a max of 25 fields so just ensuring its all good here
  const participantList = participantNames.slice(0, 25).join(', ');
  return `${participantList} ${
    selectedParticipants.length > 1 ? 'are' : 'is'
  } caught in the ambush.\n\u200b\n`;
};

const handleEventOutcome = async function ({
  occurrenceDescription,
  updatedEventData,
}) {
  if (allParticipantsKilled(updatedEventData.participants)) {
    updatedEventData.isEventOver = true;
    occurrenceDescription +=
      'All of the volunteer hunters have been defeated by the Bunny. The town is unprotected and is destroyed' +
      '\n\u200b\n';
  } else {
    occurrenceDescription +=
      'The Bunny retreats again, waiting for the next opportunity to strike..';
  }
  return { occurrenceDescription, updatedEventData };
};

module.exports = {
  generateInitialOccurrenceDescription,
  handleEventOutcome,

  async triggerBunnyAmbushOutcome({
    actionTaken = {
      actionId: null,
      interaction: null,
      messageCreatedTimestamp: null,
      occurrenceIndex: null,
      userId: null,
    },
    eventChannel,
    guildId,
    updatedEventData,
  }) {
    const difficultyModifier = 0; // TODO get this from event. Based on the initial amount of participants. Harder if more people
    const { selectedParticipants } = updatedEventData.currentOccurrence;

    /* Initialize Event Beginning */
    const occurrenceTitle = `Bradán Feasa - Easter 'Evil Bunny' - Ambush!`;
    let occurrenceDescription = await generateInitialOccurrenceDescription({
      selectedParticipants,
    });

    /* Simulate Ambush Event */
    ({ occurrenceDescription, updatedEventData } = await simulateAmbushEvent({
      difficultyModifier,
      occurrenceDescription,
      updatedEventData,
    }));

    /* handleEventOutcome */
    ({ occurrenceDescription, updatedEventData } = await handleEventOutcome({
      occurrenceDescription,
      updatedEventData,
    }));

    /* getEventOutcomeMessage */
    /* TODO - make this a generic util */
    const { embeddedMessage } = await getEasterHuntEventOutcomePage({
      eventData: updatedEventData,
      guildId,
      occurrenceDescription,
      occurrenceTitle,
    });

    /* sendEventOutcomeMessage */
    await sendEventOutcomeMessage({
      actionTaken,
      eventChannel,
      embeddedMessage,
    });

    return updatedEventData;
  },
};
