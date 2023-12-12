const { rollD20 } = require('../../../../utils');
const {
  selectRandomMessage,
  handleParticipantDeath,
  handleParticipantEscape,
} = require('../../easterEvilBunnyHuntUtils');
const { BUNNY_ATTACKS } = require('../easterEvilBunnyOccurrencesConstants');

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
    occurrenceDescription += '```';
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
    occurrenceDescription += '```\n';
  }
  return {
    occurrenceDescription,
    updatedEventData,
  };
};
module.exports = {
  simulateAmbushEvent,
};
