const { rollD20 } = require('../../../../utils');
const {
  allParticipantsKilled,
  selectRandomMessage,
} = require('../../easterEvilBunnyHuntUtils');
const {
  simulateAmbushEvent,
  handleParticipantDeath,
} = require('../bunnyAmbushOutcome');
const {
  BUNNY_ATTACKS,
  PARTICIPANT_ATTACKS_MESSAGES,
  PARTICIPANT_ATTACKS_MISSED_MESSAGES,
} = require('../easterEvilBunnyOccurrencesConstants');

const huntingPartyGoOnHunt = async function ({
  difficultyModifier,
  occurrenceDescription,
  occurrenceTitle,
  updatedEventData,
}) {
  const { selectedParticipants } = updatedEventData.currentOccurrence;
  const initialRoll = rollD20(difficultyModifier);
  let bunnyDefeated = false;
  let bunnyHurt = false;
  let selectedAttack, selectedRandomMessageData;
  let usedMessages = [];
  occurrenceDescription += 'The party sets out to hunt the evil Bunny.\n';

  switch (true) {
    case initialRoll < 5:
      // DO AMBUSH
      occurrenceDescription =
        'However, they were not careful and the Bunny was able to ambush them!\n\u200b\n';
      occurrenceTitle = `Bradán Feasa - Easter 'Evil Bunny' - Hunt Ambush!`;

      ({ occurrenceDescription, updatedEventData } = await simulateAmbushEvent({
        difficultyModifier,
        occurrenceDescription,
        updatedEventData,
      }));

      break;

    // selectedParticipants.forEach((selectedParticipant) => {
    //   const username = selectedParticipant.username;
    //   const availableBunnyAttacks = BUNNY_ATTACKS.filter(
    //     (message) => !usedMessages.includes(message)
    //   );
    //   const randomAttackIndex = Math.floor(
    //     Math.random() * availableBunnyAttacks.length
    //   );
    //   usedMessages.push(availableBunnyAttacks[randomAttackIndex]);
    //   const selectedAttack = availableBunnyAttacks[randomAttackIndex].replace(
    //     /{USERNAME}/g,
    //     username
    //   );
    //   occurrenceDescription += selectedAttack + '\n';

    //   if (rollD20(difficultyModifier) < 11) {
    //     const participantIndex = updatedEventData.participants.findIndex(
    //       (participant) => participant.userId === selectedParticipant.userId
    //     );
    //     updatedEventData.participants[participantIndex].isAlive = false;

    //     const availableParticipantDeathMessages =
    //       PARTICIPANT_DEATH_MESSAGES.filter(
    //         (message) => !usedMessages.includes(message)
    //       );
    //     const randomDeathMessageIndex = Math.floor(
    //       Math.random() * availableParticipantDeathMessages.length
    //     );
    //     usedMessages.push(
    //       availableParticipantDeathMessages[randomDeathMessageIndex]
    //     );
    //     const selectedDeathMessage = availableParticipantDeathMessages[
    //       randomDeathMessageIndex
    //     ].replace(/{USERNAME}/g, username);
    //     occurrenceDescription += selectedDeathMessage + '\n\u200b\n';
    //   } else {
    //     const availableEscapeMessages = PARTICIPANT_ESCAPE_MESSAGES.filter(
    //       (message) => !usedMessages.includes(message)
    //     );
    //     const randomEscapeMessageIndex = Math.floor(
    //       Math.random() * availableEscapeMessages.length
    //     );
    //     usedMessages.push(availableEscapeMessages[randomEscapeMessageIndex]);
    //     const selectedEscapeMessage = availableEscapeMessages[
    //       randomEscapeMessageIndex
    //     ].replace(/{USERNAME}/g, username);
    //     occurrenceDescription += selectedEscapeMessage + '\n\u200b\n';
    //   }
    // });

    case initialRoll >= 5 && initialRoll < 15:
      // Do not found
      occurrenceDescription +=
        'They searched for hours but could not find the Bunny. They give up and go back to the town for the night.\n';

    case initialRoll >= 15:
      // Do found bunny
      occurrenceDescription =
        'They were able to find large paw-prints and tracked them to find the Bunny!\n\u200b\n';

      for (const selectedParticipant of updatedEventData.currentOccurrence
        .selectedParticipants) {
        const { username, userId } = selectedParticipant;

        const attackRoll = rollD20(difficultyModifier);
        switch (true) {
          case attackRoll < 5:
            // Bunny found but attacks first
            selectedRandomMessageData = selectRandomMessage({
              messages: BUNNY_ATTACKS,
              usedMessages,
            });
            selectedAttack = selectedRandomMessageData.selectedMessage.replace(
              /{USERNAME}/g,
              username
            );
            occurrenceDescription += selectedAttack + '\n';

            ({ occurrenceDescription, updatedEventData, usedMessages } =
              await handleParticipantDeath({
                occurrenceDescription,
                updatedEventData,
                usedMessages,
                userId,
                username,
              }));
          // const participantIndex = updatedEventData.participants.findIndex(
          //   (participant) => {
          //     return participant.userId === selectedParticipant.userId;
          //   }
          // );
          // console.log(selectedParticipant);
          // console.log(participantIndex);
          // console.log(updatedEventData.participants);
          // updatedEventData.participants[participantIndex].isAlive = false;

          // const availableParticipantDeathMessages =
          //   PARTICIPANT_DEATH_MESSAGES.filter(
          //     (message) => !usedMessages.includes(message)
          //   );
          // const randomDeathMessageIndex = Math.floor(
          //   Math.random() * availableParticipantDeathMessages.length
          // );
          // usedMessages.push(
          //   availableParticipantDeathMessages[randomDeathMessageIndex]
          // );
          // const selectedDeathMessage = availableParticipantDeathMessages[
          //   randomDeathMessageIndex
          // ].replace(/{USERNAME}/g, username);
          // occurrenceDescription += selectedDeathMessage + '\n\u200b\n';
          case attackRoll >= 5 && attackRoll < 15:
            // Bunny found and participant attacks but misses
            ({ occurrenceDescription, updatedEventData, usedMessages } =
              await handleParticipantAttackMiss({
                occurrenceDescription,
                updatedEventData,
                usedMessages,
                username,
              }));

          case attackRoll >= 15:
            // Bunny found and participant attacks and hits

            // const availableParticipantAttacks = PARTICIPANT_ATTACKS.filter(
            //   (message) => !usedMessages.includes(message)
            // );
            // const randomAttackIndex = Math.floor(
            //   Math.random() * availableParticipantAttacks.length
            // );
            // usedMessages.push(availableParticipantAttacks[randomAttackIndex]);
            // const selectedParticipantAttack = availableParticipantAttacks[
            //   randomAttackIndex
            // ].replace(/{USERNAME}/g, username);
            // occurrenceDescription += selectedParticipantAttack + '\n';

            // updatedEventData.evilBunny.health -= 1;
            // bunnyHurt = true;
            // if (updatedEventData.evilBunny.health <= 0) bunnyDefeated = true;
            ({
              bunnyDefeated,
              bunnyHurt,
              occurrenceDescription,
              updatedEventData,
              usedMessages,
            } = await handleParticipantAttackHits({
              occurrenceDescription,
              updatedEventData,
              usedMessages,
              userId,
              username,
            }));
        }
      }

    default:
      console.log('Dice roll error');
  }

  //TODO
  // Check if bunny is alive. If hurt say it runs off, if ev
  if (bunnyDefeated) {
    occurrenceDescription += 'The bunny was defeated' + '\n\u200b\n';
    updatedEventData.isEventOver = true;
  }
  // TODO Everyone killed
  else if (allParticipantsKilled(updatedEventData.participants)) {
    updatedEventData.isEventOver = true;
    occurrenceDescription +=
      'All of the volunteer hunters have been defeated by the Bunny. The town is unprotected and is destroyed' +
      '\n\u200b\n';
  } else if (bunnyHurt) {
    occurrenceDescription +=
      'The bunny was hurt and retreated away' + '\n\u200b\n';
  } else {
    occurrenceDescription += 'The bunny lives another day' + '\n\u200b\n';
  }

  return { occurrenceDescription, occurrenceTitle, updatedEventData };
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
      selectedAttackMissedMessage + '\n\u200b\n'),
    updatedEventData,
    usedMessages,
  };
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
    occurrenceDescription: (occurrenceDescription +=
      selectedDeathMessage + '\n\u200b\n'),
    updatedEventData,
    usedMessages: updatedUsedMessages,
  };
};

module.exports = {
  huntingPartyGoOnHunt,
};
