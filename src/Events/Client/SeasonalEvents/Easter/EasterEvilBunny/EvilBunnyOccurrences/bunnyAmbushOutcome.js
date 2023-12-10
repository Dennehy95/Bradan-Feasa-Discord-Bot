const {
  getEasterHuntEventOutcomePage,
} = require('../../../../../../SeasonalEvents/EvilEasterBunny/Pages/getEasterHuntEventOutcomePage');
const { rollD20 } = require('../../../utils');
const {
  allParticipantsKilled,
  selectRandomMessage,
} = require('../easterEvilBunnyHuntUtils');
const {
  BUNNY_ATTACKS,
  PARTICIPANT_DEATH_MESSAGES,
  PARTICIPANT_ESCAPE_MESSAGES,
} = require('./easterEvilBunnyOccurrencesConstants');

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

const simulateAmbushEvent = async function ({
  difficultyModifier,
  occurrenceDescription,
  updatedEventData,
}) {
  let usedMessages = [];

  for (const selectedParticipant of updatedEventData.currentOccurrence
    .selectedParticipants) {
    const { username, userId } = selectedParticipant;
    const selectedRandomMessageData = selectRandomMessage({
      messages: BUNNY_ATTACKS,
      usedMessages,
    });
    const selectedAttack = selectedRandomMessageData.selectedMessage.replace(
      /{USERNAME}/g,
      username
    );
    occurrenceDescription += selectedAttack + '\n';
    const diceRoll = rollD20(difficultyModifier);
    const participantDataHandler =
      diceRoll < 11 ? handleParticipantDeath : handleParticipantEscape;

    ({ occurrenceDescription, updatedEventData, usedMessages } =
      await participantDataHandler({
        occurrenceDescription,
        updatedEventData,
        usedMessages,
        userId,
        username,
      }));
  }
  return {
    occurrenceDescription,
    updatedEventData,
  };
};

const handleParticipantDeath = function ({
  occurrenceDescription,
  updatedEventData,
  usedMessages = [],
  userId,
  username,
}) {
  const participantIndex = updatedEventData.participants.findIndex(
    (participant) => participant.userId === userId
  );
  updatedEventData.participants[participantIndex].isAlive = false;
  let updatedUsedMessages = usedMessages;
  const selectedRandomMessageData = selectRandomMessage({
    messages: PARTICIPANT_DEATH_MESSAGES,
    usedMessages: updatedUsedMessages,
  });
  const selectedDeathMessage =
    selectedRandomMessageData.selectedMessage.replace(/{USERNAME}/g, username);
  updatedUsedMessages = selectedRandomMessageData.usedMessages;
  return {
    occurrenceDescription: (occurrenceDescription +=
      selectedDeathMessage + '\n\u200b\n'),
    updatedEventData,
    usedMessages: updatedUsedMessages,
  };
};

const handleParticipantEscape = function ({
  occurrenceDescription,
  updatedEventData,
  usedMessages = [],
  username,
}) {
  const selectedRandomMessageData = selectRandomMessage({
    messages: PARTICIPANT_ESCAPE_MESSAGES,
    usedMessages,
  });
  const selectedEscapeMessage =
    selectedRandomMessageData.selectedMessage.replace(/{USERNAME}/g, username);
  return {
    occurrenceDescription: (occurrenceDescription +=
      selectedEscapeMessage + '\n\u200b\n'),
    updatedEventData,
    usedMessages,
  };
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

const sendEventOutcomeMessage = function ({
  actionTaken,
  eventChannel,
  embeddedMessage,
}) {
  if (actionTaken.interaction) {
    actionTaken.interaction.reply({
      embeds: embeddedMessage,
      ephemeral: false,
    });
  } else {
    eventChannel.send({
      embeds: embeddedMessage,
      ephemeral: false,
    });
  }
};

module.exports = {
  generateInitialOccurrenceDescription,
  handleEventOutcome,
  handleParticipantDeath,
  handleParticipantEscape,
  sendEventOutcomeMessage,
  simulateAmbushEvent,

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
