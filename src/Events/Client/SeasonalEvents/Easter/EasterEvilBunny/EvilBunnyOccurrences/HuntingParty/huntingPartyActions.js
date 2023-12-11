const { rollD20 } = require('../../../../utils');
const {
  allParticipantsKilled,
  selectRandomMessage,
  handleParticipantDeath,
  handleParticipantAttackMiss,
  handleParticipantAttackHits,
} = require('../../easterEvilBunnyHuntUtils');
const { simulateAmbushEvent } = require('../BunnyAmbush/bunnyAmbushOutcome');
const { BUNNY_ATTACKS } = require('../easterEvilBunnyOccurrencesConstants');

const huntingPartyGoOnHunt = async function ({
  difficultyModifier,
  occurrenceDescription,
  occurrenceTitle,
  updatedEventData,
}) {
  const initialRoll = rollD20(difficultyModifier);
  let bunnyDefeated = false;
  let bunnyHurt = false;
  let selectedAttack, selectedRandomMessageData;
  let usedMessages = [];
  occurrenceDescription += 'The party sets out to hunt the evil Bunny.\n';

  switch (true) {
    case initialRoll < 5:
      // DO AMBUSH
      occurrenceDescription +=
        'However, they were not careful and the Bunny was able to ambush them!\n\u200b\n';
      occurrenceTitle = `Bradán Feasa - Easter 'Evil Bunny' - Hunt Ambush!`;

      ({ occurrenceDescription, updatedEventData } = await simulateAmbushEvent({
        difficultyModifier,
        occurrenceDescription,
        updatedEventData,
      }));
      break;
    case initialRoll >= 5 && initialRoll < 15:
      // Do not found
      occurrenceDescription +=
        'They searched for hours but could not find the Bunny. They give up and go back to the town for the night.\n';
      break;
    case initialRoll >= 15:
      // Do found bunny
      occurrenceDescription +=
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
            break;

          case attackRoll >= 5 && attackRoll < 15:
            // Bunny found and participant attacks but misses
            ({ occurrenceDescription, updatedEventData, usedMessages } =
              await handleParticipantAttackMiss({
                occurrenceDescription,
                updatedEventData,
                usedMessages,
                username,
              }));
            break;

          case attackRoll >= 15:
            // Bunny found and participant attacks and hits
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
            break;

          default:
            console.info(
              'Dice roll error: huntingPartyGoOnHunt -> Bunny found'
            );
        }
      }
      break;
    default:
      console.info('Dice roll error');
  }

  if (bunnyDefeated) {
    occurrenceDescription += 'The bunny was defeated' + '\n\u200b\n';
    updatedEventData.isEventOver = true;
  } else if (allParticipantsKilled(updatedEventData.participants)) {
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

/*
Selected participants hide to avoid going on duty

Roll a 1 and one of them is exiled and killed, the rest are forced to go on the hunt
Roll a 2-9 are caught by guards and sent out on hunt
Roll a 10-18 They manage to hide and avoid going on the hunt
Roll a 19-20 and one of them finds a strong weapon hidden somewhere
*/
const huntingPartyHide = async function ({
  difficultyModifier,
  occurrenceDescription,
  occurrenceTitle,
  updatedEventData,
}) {
  const initialRoll = rollD20(difficultyModifier);
  occurrenceDescription +=
    'The party decides to hide to avoid having to go on the hunt..\n\u200b\n';

  switch (true) {
    case initialRoll < 2:
      occurrenceDescription +=
        'However, they were spotted by the Kings guards! They decided that XX would be sent out alone as punishment. The rest are led out onto the hunt\n\u200b\n';

      //TODO
      // Kill on selected participant and remove them from the selected participants
      // TODO later, have a dice roll and if its a 20 the exiled person joins with the Bunny secretly
      ({ occurrenceDescription, occurrenceTitle, updatedEventData } =
        await huntingPartyGoOnHunt({
          difficultyModifier,
          occurrenceDescription,
          occurrenceTitle,
          updatedEventData,
        }));
      break;

    case initialRoll >= 2 && initialRoll < 10:
      occurrenceDescription +=
        'However, they were spotted by the town watch while trying to hide. They are forced to go out on the hunt.\n\u200b\n';

      //TODO
      // Kill on selected participant and remove them from the selected participants
      // TODO later, have a dice roll and if its a 20 the exiled person joins with the Bunny secretly
      ({ occurrenceDescription, occurrenceTitle, updatedEventData } =
        await huntingPartyGoOnHunt({
          difficultyModifier,
          occurrenceDescription,
          occurrenceTitle,
          updatedEventData,
        }));
      break;

    case initialRoll >= 10 && initialRoll < 19:
      occurrenceDescription +=
        'They manage to evade the town watch and avoid going out on the hunt.\n\u200b\n';
      break;

    case initialRoll >= 19:
      //TODOdomWeapon someone had stashed away
      // Select someone and store the weapon on them giving them a +1 to attack rolls
      occurrenceDescription +=
        'They manage to evade the town watch and avoid going out on the hunt. While hiding, XX found a TODOgetRandomWeapon someone had stashed away.\n\u200b\n';
      break;
  }

  return { occurrenceDescription, occurrenceTitle, updatedEventData };
};

/*
Roll a 1 instigator is caught and forced to go out on hunt
Roll a 2-9 doesn't fool others, and they all go on the hunt
Roll a 10-20 They manage to hide and avoid going on the hunt, the others go on the hunt
*/
const huntingPartyTrickOtherHunters = async function ({
  difficultyModifier,
  occurrenceDescription,
  occurrenceTitle,
  updatedEventData,
}) {
  const initialRoll = rollD20(difficultyModifier);
  occurrenceDescription +=
    'XX tries to avoid hunting party duty by YYY..\n\u200b\n';
  switch (true) {
    case initialRoll < 2:
      occurrenceDescription +=
        'However, XXX was caught trying to trick the others. They were beaten up and sent out of the hunt alone.\n\u200b\n';
      // TODO -1 debuff to Selected participant, make them the only selected participant

      //TODO
      // Kill on selected participant and remove them from the selected participants
      // TODO later, have a dice roll and if its a 20 the exiled person joins with the Bunny secretly
      ({ occurrenceDescription, occurrenceTitle, updatedEventData } =
        await huntingPartyGoOnHunt({
          difficultyModifier,
          occurrenceDescription,
          occurrenceTitle,
          updatedEventData,
        }));
      break;

    case initialRoll >= 2 && initialRoll < 10:
      occurrenceDescription +=
        'However, XX was not convincing enough and had to join the hunt with the others.\n\u200b\n';
      ({ occurrenceDescription, occurrenceTitle, updatedEventData } =
        await huntingPartyGoOnHunt({
          difficultyModifier,
          occurrenceDescription,
          occurrenceTitle,
          updatedEventData,
        }));
      break;

    case initialRoll >= 10:
      occurrenceDescription +=
        'XX managed to fool the others and avoids having to go out on the hunt!\n\u200b\n';
      // TODO remove instigator from selected participants
      ({ occurrenceDescription, occurrenceTitle, updatedEventData } =
        await huntingPartyGoOnHunt({
          difficultyModifier,
          occurrenceDescription,
          occurrenceTitle,
          updatedEventData,
        }));
      break;
    default:
      console.info('Dice roll error: huntingPartyTrickOtherHunters');
  }
  return { occurrenceDescription, occurrenceTitle, updatedEventData };
};

module.exports = {
  huntingPartyGoOnHunt,
  huntingPartyHide,
  huntingPartyTrickOtherHunters,
};
