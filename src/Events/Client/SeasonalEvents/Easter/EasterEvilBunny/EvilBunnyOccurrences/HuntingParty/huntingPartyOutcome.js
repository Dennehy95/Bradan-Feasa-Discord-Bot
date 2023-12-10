const {
  getEasterHuntEventOutcomePage,
} = require('../../../../../../../SeasonalEvents/EvilEasterBunny/Pages/getEasterHuntEventOutcomePage');
const { rollD20 } = require('../../../../utils');
const { allParticipantsKilled } = require('../../easterEvilBunnyHuntUtils');
const {
  BUNNY_ATTACKS,
  PARTICIPANT_DEATH_MESSAGES,
  PARTICIPANT_ESCAPE_MESSAGES,
  PARTICIPANT_ATTACKS_MESSAGES,
} = require('../easterEvilBunnyOccurrencesConstants');
const { huntingPartyGoOnHunt } = require('./huntingPartyActions');

const generateInitialOccurrenceDescription = async function ({
  selectedParticipants,
}) {
  const participantNames = selectedParticipants.map(
    (participant) => `<@${participant.userId}>`
  );
  // Discord has a max of 25 fields so just ensuring its all good here
  const participantList = participantNames.slice(0, 25).join(', ');
  return `${participantList}\n\u200b\n`;
};

const simulateEvent = async function ({
  difficultyModifier,
  occurrenceDescription,
  updatedEventData,
}) {
  return true;
};

/**
 * Hunting Party
 *
 * 2-4 Participants get the chance to answer. They can either hunt the bunny or hide or one member can trick the others into going without them.
 * If they hunt, each one gets a 1/8 chance to hurt the bunny (The chance will probably be dynamic later. Same with Bunny health and players may have stat boosts and stuff)
 * They also have a chance to be killed by Bunny. Many can die, many can hurt. If Bunny hits 0 that person gets the kill
 */

module.exports = {
  generateInitialOccurrenceDescription,

  async triggerHuntingPartyOutcome({
    actionTaken = {},
    eventChannel,
    guildId,
    occurrenceAction,
    updatedEventData,
  }) {
    const { selectedParticipants } = updatedEventData.currentOccurrence;
    let occurrenceDescription = await generateInitialOccurrenceDescription({
      selectedParticipants,
    });

    /* Initialize Event Beginning */
    let occurrenceTitle = `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`;

    /* Simulate Event */
    const difficultyModifier = 0; // TODO get this from event. Based on the initial amount of participants. Harder if more people
    switch (occurrenceAction?.name) {
      case 'goOnHunt':
        ({ occurrenceDescription, occurrenceTitle, updatedEventData } =
          await huntingPartyGoOnHunt({
            difficultyModifier,
            occurrenceDescription,
            occurrenceTitle,
            updatedEventData,
          }));
        break;

      case 'hide':
        console.log('hiding');
        // Roll once. If successful the party hide and nothing happens, if major fail they are caught and one of them risks being exiled
        break;
      case 'trickOtherHunters':
        console.log('tricking');
        // The user gets to hide successfully. The others go on the hunt as in the first action
        break;
      default:
        console.log('No action taken');
        occurrenceDescription += 'No action taken';
        // Either you feel asleep, or you forgot to go on hunt
        // Random chance, either King chastises the group and nothing happens, or one member is exiled from the city and Eaten by the Bunny
        break;
    }

    const { embeddedMessage } = await getEasterHuntEventOutcomePage({
      guildId,
      occurrenceDescription,
      occurrenceTitle,
    });
    if (actionTaken.interaction) {
      await actionTaken.interaction.reply({
        embeds: embeddedMessage,
        ephemeral: false,
      });
    } else {
      await eventChannel.send({
        embeds: embeddedMessage,
        ephemeral: false,
      });
    }

    return updatedEventData;
  },
};
