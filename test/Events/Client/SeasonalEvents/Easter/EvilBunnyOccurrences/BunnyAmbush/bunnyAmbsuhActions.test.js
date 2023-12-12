const _ = require('lodash');
const INITIAL_MOCK_DATA = require('../../bunnyOutcomeMockData.json');
const {
  simulateAmbushEvent,
} = require('../../../../../../../src/Events/Client/SeasonalEvents/Easter/EasterEvilBunny/EvilBunnyOccurrences/BunnyAmbush/bunnyAmbushActions');
let CLONED_MOCK_DATA = {};

describe('bunnyAmbushActions', () => {
  beforeEach(() => {
    CLONED_MOCK_DATA = _.cloneDeep(INITIAL_MOCK_DATA);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('simulateAmbushEvent', () => {
    test('should simulate the event successfully', async () => {
      const data = {
        difficultyModifier: 0,
        occurrenceDescription: 'Initial description ',
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      };
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Dice roll bunny attack
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Dice roll if killed
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Random death message selection
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Dice roll bunny attack
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.99999); // Dice roll if escape
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Random escape message selection
      const result = await simulateAmbushEvent(data);

      expect(result).toEqual({
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        occurrenceDescription: `Initial description \`\`\`With lightning speed, the bunny hopped towards MockUser1Username, razor-sharp eggs flying in all directions.\nMockUser1Username stumbles backwards as the bunny's massive paw connects with their chest, knocking them to the ground and leaving them gasping for air. A final swipe and MockUser1Username is no more\`\`\`\n\`\`\`The bunny hops towards MockUser2Username, its beady eyes glowing with malevolence as it strikes with its sharp claws!\nAs the evil Easter Bunny closed in, MockUser2Username scrambled up a nearby tree and managed to get out of reach just in the nick of time!\`\`\`\n`,
      });
      // @ts-ignore
      global.Math.random.mockRestore();
    });
  });
});
