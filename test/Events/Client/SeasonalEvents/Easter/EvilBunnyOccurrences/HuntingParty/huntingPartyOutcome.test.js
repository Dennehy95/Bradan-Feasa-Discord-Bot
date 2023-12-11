const _ = require('lodash');
const huntingPartyOutcome = require('../../../../../../../src/Events/Client/SeasonalEvents/Easter/EasterEvilBunny/EvilBunnyOccurrences/HuntingParty/huntingPartyOutcome');
const INITIAL_MOCK_DATA = require('../../bunnyOutcomeMockData.json');
let CLONED_MOCK_DATA = {};

describe('huntingPartyOutcome', () => {
  beforeEach(() => {
    CLONED_MOCK_DATA = _.cloneDeep(INITIAL_MOCK_DATA);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('generateInitialOccurrenceDescription', () => {
    test('should generate initial occurrence description for one participant', async () => {
      const result =
        await huntingPartyOutcome.generateInitialOccurrenceDescription({
          selectedParticipants: [CLONED_MOCK_DATA.MOCK_PARTICIPANT_1],
        });

      // Perform assertions on the result
      expect(result).toContain(
        `<@${CLONED_MOCK_DATA.MOCK_PARTICIPANT_1.userId}>\n​\n`
      );
    });
    test('should generate initial occurrence description for multiple participants', async () => {
      const result =
        await huntingPartyOutcome.generateInitialOccurrenceDescription({
          selectedParticipants: CLONED_MOCK_DATA.MOCK_SELECTED_PARTICIPANTS,
        });

      // Perform assertions on the result
      expect(result).toContain(
        `<@${CLONED_MOCK_DATA.MOCK_PARTICIPANT_1.userId}>, <@${CLONED_MOCK_DATA.MOCK_PARTICIPANT_2.userId}>\n​\n`
      );
    });
  });
});
