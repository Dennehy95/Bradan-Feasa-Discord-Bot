const _ = require('lodash');
const {
  selectRandomMessage,
  handleParticipantEscape,
  handleParticipantDeath,
} = require('../../../../../src/Events/Client/SeasonalEvents/Easter/EasterEvilBunny/easterEvilBunnyHuntUtils');
const {
  PARTICIPANT_ESCAPE_MESSAGES,
  PARTICIPANT_DEATH_MESSAGES,
} = require('../../../../../src/Events/Client/SeasonalEvents/Easter/EasterEvilBunny/EvilBunnyOccurrences/easterEvilBunnyOccurrencesConstants');
const INITIAL_MOCK_DATA = require('./bunnyOutcomeMockData.json');
let CLONED_MOCK_DATA = {};

describe('easterEvilBunnyHuntUtils', () => {
  beforeEach(() => {
    CLONED_MOCK_DATA = _.cloneDeep(INITIAL_MOCK_DATA);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('handleParticipantDeath', () => {
    const MOCK_MESSAGES = _.cloneDeep(PARTICIPANT_DEATH_MESSAGES);
    test('should handle participant death by marking them as not alive, returning a death message with their name and adding selected message to usedMessages', () => {
      const data = {
        occurrenceDescription: 'Initial description ',
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        usedMessages: [MOCK_MESSAGES[0]],
        userId: CLONED_MOCK_DATA.MOCK_PARTICIPANTS[0].userId,
        username: CLONED_MOCK_DATA.MOCK_PARTICIPANTS[0].username,
      };

      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = handleParticipantDeath(data);
      expect(result.occurrenceDescription).toEqual(
        `Initial description With a sickening crunch, the bunny's teeth sink into MockUser1Username's shoulder, tearing through flesh and muscle with terrifying ease. MockUser1Username lies in pieces on the ground\n\u200b\n`
      );
      expect(result.usedMessages).toEqual([MOCK_MESSAGES[0], MOCK_MESSAGES[1]]);

      const participantIndex = data.updatedEventData.participants.findIndex(
        (participant) => participant.userId === data.userId
      );
      expect(data.updatedEventData.participants[participantIndex].isAlive).toBe(
        false
      );
    });
  });

  describe('handleParticipantEscape', () => {
    const MOCK_MESSAGES = _.cloneDeep(PARTICIPANT_ESCAPE_MESSAGES);
    test('should handle participant escape by returning an escape message with their name and adding selected message to usedMessages', () => {
      const data = {
        occurrenceDescription: 'Initial description ',
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        usedMessages: [MOCK_MESSAGES[0]],
        userId: CLONED_MOCK_DATA.MOCK_PARTICIPANTS[0].userId,
        username: CLONED_MOCK_DATA.MOCK_PARTICIPANTS[0].username,
      };

      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = handleParticipantEscape(data);
      expect(result.occurrenceDescription).toEqual(
        `Initial description With a fierce determination, the evil Easter Bunny chased after MockUser1Username, but MockUser1Username managed to stay one step ahead and narrowly escaped its grasp!\n\u200b\n`
      );
      expect(result.usedMessages).toEqual([MOCK_MESSAGES[0], MOCK_MESSAGES[1]]);

      const participantIndex = data.updatedEventData.participants.findIndex(
        (participant) => participant.userId === data.userId
      );
      expect(data.updatedEventData.participants[participantIndex].isAlive).toBe(
        true
      );
    });
  });

  describe('selectRandomMessage', () => {
    test('should select a random message', () => {
      const mockMessages = ['Message1', 'Message2', 'Message3'];
      const mockUsedMessages = ['Message1'];

      jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

      const result = selectRandomMessage({
        messages: mockMessages,
        usedMessages: mockUsedMessages,
      });

      expect(result).toEqual({
        selectedMessage: 'Message3',
        usedMessages: ['Message1', 'Message3'],
      });

      // @ts-ignore
      global.Math.random.mockRestore();
    });

    test('should reset used messages if used all', () => {
      const mockMessages = ['Message1', 'Message2', 'Message3'];
      const mockUsedMessages = ['Message1', 'Message2', 'Message3'];

      jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

      const result = selectRandomMessage({
        messages: mockMessages,
        usedMessages: mockUsedMessages,
      });

      expect(result).toEqual({
        selectedMessage: 'Message2',
        usedMessages: ['Message2'],
      });

      global.Math.random.mockRestore();
    });
  });
});
