const _ = require('lodash');
const bunnyAmbushOutcome = require('../../../../../../src/Events/Client/SeasonalEvents/Easter/EasterEvilBunny/EvilBunnyOccurrences/bunnyAmbushOutcome');
const {
  PARTICIPANT_DEATH_MESSAGES,
  PARTICIPANT_ESCAPE_MESSAGES,
} = require('../../../../../../src/Events/Client/SeasonalEvents/Easter/EasterEvilBunny/EvilBunnyOccurrences/easterEvilBunnyOccurrencesConstants');

const INITIAL_MOCK_DATA = require('./bunnyAmbushOutcomeMockData.json');
let CLONED_MOCK_DATA = {};

describe('bunnyAmbushOutcome', () => {
  beforeEach(() => {
    CLONED_MOCK_DATA = _.cloneDeep(INITIAL_MOCK_DATA);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('generateInitialOccurrenceDescription', () => {
    test('should generate initial occurrence description for one participant', async () => {
      const result =
        await bunnyAmbushOutcome.generateInitialOccurrenceDescription({
          selectedParticipants: [CLONED_MOCK_DATA.MOCK_PARTICIPANT_1],
        });

      // Perform assertions on the result
      expect(result).toContain(
        `<@${CLONED_MOCK_DATA.MOCK_PARTICIPANT_1.userId}> is caught in the ambush.\n​\n`
      );
    });
    test('should generate initial occurrence description for multiple participants', async () => {
      const result =
        await bunnyAmbushOutcome.generateInitialOccurrenceDescription({
          selectedParticipants: CLONED_MOCK_DATA.MOCK_SELECTED_PARTICIPANTS,
        });

      // Perform assertions on the result
      expect(result).toContain(
        `<@${CLONED_MOCK_DATA.MOCK_PARTICIPANT_1.userId}>, <@${CLONED_MOCK_DATA.MOCK_PARTICIPANT_2.userId}> are caught in the ambush.\n​\n`
      );
    });
  });

  // describe('simulateAmbushEvent', () => {
  //   test('should simulate the event successfully', async () => {
  //     const data = {
  //       difficultyModifier: 0,
  //       occurrenceDescription: 'Initial description ',
  //       updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
  //     };
  //     jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Dice roll bunny attack
  //     jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Dice roll if killed
  //     jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Random death message selection
  //     jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Dice roll bunny attack
  //     jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.99999); // Dice roll if escape
  //     jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Random escape message selection
  //     const result = await bunnyAmbushOutcome.simulateAmbushEvent(data);

  //     expect(result).toEqual({
  //       updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
  //       occurrenceDescription: `Initial description With lightning speed, the bunny hopped towards MockUser1Username, razor-sharp eggs flying in all directions.\nMockUser1Username stumbles backwards as the bunny's massive paw connects with their chest, knocking them to the ground and leaving them gasping for air. A final swipe and MockUser1Username is no more\n\u200b\nThe bunny hops towards MockUser2Username, its beady eyes glowing with malevolence as it strikes with its sharp claws!\nAs the evil Easter Bunny closed in, MockUser2Username scrambled up a nearby tree and managed to get out of reach just in the nick of time!\n\u200b\n`,
  //     });
  //     // @ts-ignore
  //     global.Math.random.mockRestore();
  //   });
  // });

  // describe('selectRandomMessage', () => {
  //   test('should select a random message', () => {
  //     const mockMessages = ['Message1', 'Message2', 'Message3'];
  //     const mockUsedMessages = ['Message1'];

  //     jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

  //     const result = bunnyAmbushOutcome.selectRandomMessage({
  //       messages: mockMessages,
  //       usedMessages: mockUsedMessages,
  //     });

  //     expect(result).toEqual({
  //       selectedMessage: 'Message3',
  //       usedMessages: ['Message1', 'Message3'],
  //     });

  //     // @ts-ignore
  //     global.Math.random.mockRestore();
  //   });

  //   test('should reset used messages if used all', () => {
  //     const mockMessages = ['Message1', 'Message2', 'Message3'];
  //     const mockUsedMessages = ['Message1', 'Message2', 'Message3'];

  //     jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

  //     const result = bunnyAmbushOutcome.selectRandomMessage({
  //       messages: mockMessages,
  //       usedMessages: mockUsedMessages,
  //     });

  //     expect(result).toEqual({
  //       selectedMessage: 'Message2',
  //       usedMessages: ['Message2'],
  //     });

  //     global.Math.random.mockRestore();
  //   });
  // });

  // describe('handleParticipantDeath', () => {
  //   const MOCK_MESSAGES = _.cloneDeep(PARTICIPANT_DEATH_MESSAGES);
  //   test('should handle participant death by marking them as not alive, returning a death message with their name and adding selected message to usedMessages', () => {
  //     const data = {
  //       occurrenceDescription: 'Initial description ',
  //       updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
  //       usedMessages: [MOCK_MESSAGES[0]],
  //       userId: CLONED_MOCK_DATA.MOCK_PARTICIPANTS[0].userId,
  //       username: CLONED_MOCK_DATA.MOCK_PARTICIPANTS[0].username,
  //     };

  //     jest.spyOn(global.Math, 'random').mockReturnValue(0);
  //     const result = bunnyAmbushOutcome.handleParticipantDeath(data);
  //     expect(result.occurrenceDescription).toEqual(
  //       `Initial description With a sickening crunch, the bunny's teeth sink into MockUser1Username's shoulder, tearing through flesh and muscle with terrifying ease. MockUser1Username lies in pieces on the ground\n\u200b\n`
  //     );
  //     expect(result.usedMessages).toEqual([MOCK_MESSAGES[0], MOCK_MESSAGES[1]]);

  //     const participantIndex = data.updatedEventData.participants.findIndex(
  //       (participant) => participant.userId === data.userId
  //     );
  //     expect(data.updatedEventData.participants[participantIndex].isAlive).toBe(
  //       false
  //     );
  //   });
  // });

  // describe('handleParticipantEscape', () => {
  //   const MOCK_MESSAGES = _.cloneDeep(PARTICIPANT_ESCAPE_MESSAGES);
  //   test('should handle participant escape by returning an escape message with their name and adding selected message to usedMessages', () => {
  //     const data = {
  //       occurrenceDescription: 'Initial description ',
  //       updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
  //       usedMessages: [MOCK_MESSAGES[0]],
  //       userId: CLONED_MOCK_DATA.MOCK_PARTICIPANTS[0].userId,
  //       username: CLONED_MOCK_DATA.MOCK_PARTICIPANTS[0].username,
  //     };

  //     jest.spyOn(global.Math, 'random').mockReturnValue(0);
  //     const result = bunnyAmbushOutcome.handleParticipantEscape(data);
  //     expect(result.occurrenceDescription).toEqual(
  //       `Initial description With a fierce determination, the evil Easter Bunny chased after MockUser1Username, but MockUser1Username managed to stay one step ahead and narrowly escaped its grasp!\n\u200b\n`
  //     );
  //     expect(result.usedMessages).toEqual([MOCK_MESSAGES[0], MOCK_MESSAGES[1]]);

  //     const participantIndex = data.updatedEventData.participants.findIndex(
  //       (participant) => participant.userId === data.userId
  //     );
  //     expect(data.updatedEventData.participants[participantIndex].isAlive).toBe(
  //       true
  //     );
  //   });
  // });

  // describe('handleEventOutcome', () => {
  //   test('should return message when all participants are killed', async () => {
  //     CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA.participants =
  //       CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA.participants.map(
  //         (participant) => (participant.isAlive = false)
  //       );
  //     const result = await bunnyAmbushOutcome.handleEventOutcome({
  //       occurrenceDescription: 'InitialDescription: ',
  //       updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
  //     });
  //     expect(result).toEqual({
  //       occurrenceDescription:
  //         'InitialDescription: All of the volunteer hunters have been defeated by the Bunny. The town is unprotected and is destroyed\n\u200b\n',
  //       updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
  //     });
  //   });
  //   test('should return message when bunny retreats', async () => {
  //     const result = await bunnyAmbushOutcome.handleEventOutcome({
  //       occurrenceDescription: 'InitialDescription: ',
  //       updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
  //     });
  //     expect(result).toEqual({
  //       occurrenceDescription:
  //         'InitialDescription: The Bunny retreats again, waiting for the next opportunity to strike..',
  //       updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
  //     });
  //   });
  // });

  // describe('sendEventOutcomeMessage', () => {
  //   test('should send message to interaction reply if interaction is provided', () => {
  //     const mockEventChannel = CLONED_MOCK_DATA.MOCK_EVENT_CHANNEL;
  //     const mockActionTaken = { interaction: {} };
  //     mockActionTaken.interaction.reply = jest.fn();
  //     const mockEmbeddedMessage = CLONED_MOCK_DATA.MOCK_EMBEDDED_MESSAGE;
  //     const mockActionTakenSpy = jest.spyOn(
  //       mockActionTaken.interaction,
  //       'reply'
  //     );

  //     bunnyAmbushOutcome.sendEventOutcomeMessage({
  //       actionTaken: mockActionTaken,
  //       eventChannel: mockEventChannel,
  //       embeddedMessage: mockEmbeddedMessage,
  //     });

  //     expect(mockActionTakenSpy).toHaveBeenCalledWith({
  //       embeds: mockEmbeddedMessage,
  //       ephemeral: false,
  //     });

  //     // @ts-ignore
  //     mockActionTakenSpy.mockRestore();
  //   });

  //   test('should send message to channel if interaction is not provided', () => {
  //     const mockEventChannel = CLONED_MOCK_DATA.MOCK_EVENT_CHANNEL;
  //     mockEventChannel.send = jest.fn();
  //     const mockActionTaken = {}; // No interaction provided
  //     const mockEmbeddedMessage = CLONED_MOCK_DATA.MOCK_EMBEDDED_MESSAGE;
  //     const eventChannelSendSpy = jest.spyOn(mockEventChannel, 'send');

  //     bunnyAmbushOutcome.sendEventOutcomeMessage({
  //       actionTaken: mockActionTaken,
  //       eventChannel: mockEventChannel,
  //       embeddedMessage: mockEmbeddedMessage,
  //     });

  //     expect(eventChannelSendSpy).toHaveBeenCalledWith({
  //       embeds: mockEmbeddedMessage,
  //       ephemeral: false,
  //     });

  //     eventChannelSendSpy.mockRestore();
  //   });
  // });
});
