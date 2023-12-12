const {
  PARTICIPANT_DEATH_MESSAGES,
  PARTICIPANT_ESCAPE_MESSAGES,
  PARTICIPANT_ATTACKS_MESSAGES,
  PARTICIPANT_ATTACKS_MISSED_MESSAGES,
} = require('./EvilBunnyOccurrences/easterEvilBunnyOccurrencesConstants');

const allParticipantsKilled = function (participants) {
  return !participants.some((participant) => participant.isAlive);
};

const handleParticipantAttackHits = function ({
  occurrenceDescription,
  updatedEventData,
  usedMessages = [],
  userId,
  username,
}) {
  const participantIndex = updatedEventData.participants.findIndex(
    (participant) => participant.userId === userId
  );
  let updatedUsedMessages = usedMessages;
  const selectedRandomMessageData = selectRandomMessage({
    messages: PARTICIPANT_ATTACKS_MESSAGES,
    usedMessages: updatedUsedMessages,
  });
  const selectedDeathMessage =
    selectedRandomMessageData.selectedMessage.replace(/{USERNAME}/g, username);
  updatedUsedMessages = selectedRandomMessageData.usedMessages;
  updatedEventData.evilBunny.health -= 1;
  const bunnyHurt = true;
  let bunnyDefeated = false;
  if (updatedEventData.evilBunny.health <= 0) bunnyDefeated = true;
  return {
    bunnyDefeated,
    bunnyHurt,
    occurrenceDescription: (occurrenceDescription += selectedDeathMessage),
    updatedEventData,
    usedMessages: updatedUsedMessages,
  };
};

const handleParticipantAttackMiss = function ({
  occurrenceDescription,
  updatedEventData,
  usedMessages = [],
  username,
}) {
  const selectedRandomMessageData = selectRandomMessage({
    messages: PARTICIPANT_ATTACKS_MISSED_MESSAGES,
    usedMessages,
  });
  const selectedAttackMissedMessage =
    selectedRandomMessageData.selectedMessage.replace(/{USERNAME}/g, username);
  return {
    occurrenceDescription: (occurrenceDescription +=
      selectedAttackMissedMessage),
    updatedEventData,
    usedMessages,
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
    occurrenceDescription: (occurrenceDescription += selectedDeathMessage),
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
    occurrenceDescription: (occurrenceDescription += selectedEscapeMessage),
    updatedEventData,
    usedMessages,
  };
};

const selectRandomMessage = function ({ messages, usedMessages }) {
  let updatedUsedMessages = usedMessages;
  if (messages.length <= updatedUsedMessages.length) {
    updatedUsedMessages = [];
  }
  const availableMessages = messages.filter(
    (message) => !updatedUsedMessages.includes(message)
  );
  const randomIndex = Math.floor(Math.random() * availableMessages.length);
  updatedUsedMessages.push(availableMessages[randomIndex]);
  return {
    selectedMessage: availableMessages[randomIndex],
    usedMessages: updatedUsedMessages,
  };
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
  allParticipantsKilled,
  handleParticipantAttackHits,
  handleParticipantAttackMiss,
  handleParticipantDeath,
  handleParticipantEscape,
  selectRandomMessage,
  sendEventOutcomeMessage,
};
