const _ = require('lodash');
const huntingPartyActions = require('../../../../../../../src/Events/Client/SeasonalEvents/Easter/EasterEvilBunny/EvilBunnyOccurrences/HuntingParty/huntingPartyActions');
const INITIAL_MOCK_DATA = require('../../bunnyOutcomeMockData.json');
let CLONED_MOCK_DATA = {};

describe('huntingPartyActions', () => {
  beforeEach(() => {
    CLONED_MOCK_DATA = _.cloneDeep(INITIAL_MOCK_DATA);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('huntingPartyGoOnHunt', () => {
    test('should handle ambush event when initial roll is less than 5', async () => {
      const data = {
        difficultyModifier: 0,
        occurrenceDescription: 'InitialDescription: ',
        occurrenceTitle: `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`,
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      };
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = await huntingPartyActions.huntingPartyGoOnHunt(data);

      expect(result).toEqual({
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        occurrenceDescription: `InitialDescription: The party sets out to hunt the evil Bunny.\nHowever, they were not careful and the Bunny was able to ambush them!\n\u200b\n\`\`\`With lightning speed, the bunny hopped towards MockUser1Username, razor-sharp eggs flying in all directions.\nMockUser1Username stumbles backwards as the bunny's massive paw connects with their chest, knocking them to the ground and leaving them gasping for air. A final swipe and MockUser1Username is no more\`\`\`\n\`\`\`The bunny hops towards MockUser2Username, its beady eyes glowing with malevolence as it strikes with its sharp claws!\nWith a sickening crunch, the bunny's teeth sink into MockUser2Username's shoulder, tearing through flesh and muscle with terrifying ease. MockUser2Username lies in pieces on the ground\`\`\`\nThe bunny lives another day\n\u200b\n`,
        occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Hunt Ambush!",
      });
      // @ts-ignore
      global.Math.random.mockRestore();
    });

    test('should handle bunny not found event when initial roll is greater than or equal to 5 but less than 15', async () => {
      const data = {
        difficultyModifier: 0,
        occurrenceDescription: 'InitialDescription: ',
        occurrenceTitle: `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`,
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      };
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.5);
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = await huntingPartyActions.huntingPartyGoOnHunt(data);

      expect(result).toEqual({
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        occurrenceDescription: `InitialDescription: The party sets out to hunt the evil Bunny.\n\`\`\`They searched for hours but could not find the Bunny. They give up and go back to the town for the night.\`\`\`\nThe bunny lives another day\n\u200b\n`,
        occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Hunt!",
      });
      // @ts-ignore
      global.Math.random.mockRestore();
    });

    test('should handle bunny found event when initial roll is greater than or equal to 15', async () => {
      const data = {
        difficultyModifier: 0,
        occurrenceDescription: 'InitialDescription: ',
        occurrenceTitle: `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`,
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      };
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(1);
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = await huntingPartyActions.huntingPartyGoOnHunt(data);

      expect(result).toEqual({
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        occurrenceDescription: `InitialDescription: The party sets out to hunt the evil Bunny.\nThey were able to find large paw-prints and tracked them to find the Bunny!\n\u200b\n\`\`\`With lightning speed, the bunny hopped towards MockUser1Username, razor-sharp eggs flying in all directions.\nMockUser1Username stumbles backwards as the bunny's massive paw connects with their chest, knocking them to the ground and leaving them gasping for air. A final swipe and MockUser1Username is no more\`\`\`\n\`\`\`The bunny hops towards MockUser2Username, its beady eyes glowing with malevolence as it strikes with its sharp claws!\nWith a sickening crunch, the bunny's teeth sink into MockUser2Username's shoulder, tearing through flesh and muscle with terrifying ease. MockUser2Username lies in pieces on the ground\`\`\`\nThe bunny lives another day\n\u200b\n`,
        occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Hunt!",
      });
      // @ts-ignore
      global.Math.random.mockRestore();
    });

    // test('should handle bunny hurt after attacked', async () => {
    //   const data = {
    //     difficultyModifier: 0,
    //     occurrenceDescription: 'InitialDescription: ',
    //     occurrenceTitle: `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`,
    //     updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
    //   };
    //   jest.spyOn(global.Math, 'random').mockReturnValueOnce(1);
    //   jest.spyOn(global.Math, 'random').mockReturnValue(0);
    //   const result = await huntingPartyActions.huntingPartyGoOnHunt(data);

    //   expect(result).toEqual({
    //     updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
    //     occurrenceDescription: `InitialDescription: The party sets out to hunt the evil Bunny.\nThey were able to find large paw-prints and tracked them to find the Bunny!\n\u200b\n\`\`\`With lightning speed, the bunny hopped towards MockUser1Username, razor-sharp eggs flying in all directions.\nMockUser1Username stumbles backwards as the bunny's massive paw connects with their chest, knocking them to the ground and leaving them gasping for air. A final swipe and MockUser1Username is no more\`\`\`\n\`\`\`The bunny hops towards MockUser2Username, its beady eyes glowing with malevolence as it strikes with its sharp claws!\nWith a sickening crunch, the bunny's teeth sink into MockUser2Username's shoulder, tearing through flesh and muscle with terrifying ease. MockUser2Username lies in pieces on the ground\`\`\`\nThe bunny lives another day\n\u200b\n`,
    //     occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Hunt!",
    //   });
    //   // @ts-ignore
    //   global.Math.random.mockRestore();
    // });
    // test('should handle bunny killed after attacked', async () => {
    //   const data = {
    //     difficultyModifier: 0,
    //     occurrenceDescription: 'InitialDescription: ',
    //     occurrenceTitle: `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`,
    //     updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
    //   };
    //   jest.spyOn(global.Math, 'random').mockReturnValueOnce(1);
    //   jest.spyOn(global.Math, 'random').mockReturnValue(0);
    //   const result = await huntingPartyActions.huntingPartyGoOnHunt(data);

    //   expect(result).toEqual({
    //     updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
    //     occurrenceDescription: `InitialDescription: The party sets out to hunt the evil Bunny.\nThey were able to find large paw-prints and tracked them to find the Bunny!\n\u200b\n\`\`\`With lightning speed, the bunny hopped towards MockUser1Username, razor-sharp eggs flying in all directions.\nMockUser1Username stumbles backwards as the bunny's massive paw connects with their chest, knocking them to the ground and leaving them gasping for air. A final swipe and MockUser1Username is no more\`\`\`\n\`\`\`The bunny hops towards MockUser2Username, its beady eyes glowing with malevolence as it strikes with its sharp claws!\nWith a sickening crunch, the bunny's teeth sink into MockUser2Username's shoulder, tearing through flesh and muscle with terrifying ease. MockUser2Username lies in pieces on the ground\`\`\`\nThe bunny lives another day\n\u200b\n`,
    //     occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Hunt!",
    //   });
    //   // @ts-ignore
    //   global.Math.random.mockRestore();
    // });
  });

  describe('huntingPartyHide', () => {
    test('should handle caught by Kings Guard event when initial roll is less than 2', async () => {
      const data = {
        difficultyModifier: 0,
        occurrenceDescription: 'InitialDescription: ',
        occurrenceTitle: `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`,
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      };
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = await huntingPartyActions.huntingPartyHide(data);

      expect(result).toEqual({
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        occurrenceDescription: `InitialDescription: The party decides to hide to avoid having to go on the hunt..\n\u200b\n\`\`\`However, they were spotted by the Kings guards! They decided that XX would be sent out alone as punishment. The rest are led out onto the hunt\`\`\`\nThe party sets out to hunt the evil Bunny.\nHowever, they were not careful and the Bunny was able to ambush them!\n\u200b\n\`\`\`With lightning speed, the bunny hopped towards MockUser1Username, razor-sharp eggs flying in all directions.\nMockUser1Username stumbles backwards as the bunny's massive paw connects with their chest, knocking them to the ground and leaving them gasping for air. A final swipe and MockUser1Username is no more\`\`\`\n\`\`\`The bunny hops towards MockUser2Username, its beady eyes glowing with malevolence as it strikes with its sharp claws!\nWith a sickening crunch, the bunny's teeth sink into MockUser2Username's shoulder, tearing through flesh and muscle with terrifying ease. MockUser2Username lies in pieces on the ground\`\`\`\nThe bunny lives another day\n\u200b\n`,
        occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Hunt Ambush!",
      });
      // @ts-ignore
      global.Math.random.mockRestore();
    });

    test('should handle caught by town watch event when initial roll is greater or equal to 2 and less than 10', async () => {
      const data = {
        difficultyModifier: 0,
        occurrenceDescription: 'InitialDescription: ',
        occurrenceTitle: `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`,
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      };
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.25);
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = await huntingPartyActions.huntingPartyHide(data);

      expect(result).toEqual({
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        occurrenceDescription: `InitialDescription: The party decides to hide to avoid having to go on the hunt..\n\u200b\n\`\`\`However, they were spotted by the town watch while trying to hide. They are forced to go out on the hunt.\`\`\`\nThe party sets out to hunt the evil Bunny.\nHowever, they were not careful and the Bunny was able to ambush them!\n\u200b\n\`\`\`With lightning speed, the bunny hopped towards MockUser1Username, razor-sharp eggs flying in all directions.\nMockUser1Username stumbles backwards as the bunny's massive paw connects with their chest, knocking them to the ground and leaving them gasping for air. A final swipe and MockUser1Username is no more\`\`\`\n\`\`\`The bunny hops towards MockUser2Username, its beady eyes glowing with malevolence as it strikes with its sharp claws!\nWith a sickening crunch, the bunny's teeth sink into MockUser2Username's shoulder, tearing through flesh and muscle with terrifying ease. MockUser2Username lies in pieces on the ground\`\`\`\nThe bunny lives another day\n\u200b\n`,
        occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Hunt Ambush!",
      });
      // @ts-ignore
      global.Math.random.mockRestore();
    });

    test('should handle successfully hide event when initial roll is greater or equal to 10 and less than 19', async () => {
      const data = {
        difficultyModifier: 0,
        occurrenceDescription: 'InitialDescription: ',
        occurrenceTitle: `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`,
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      };
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.5);
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = await huntingPartyActions.huntingPartyHide(data);

      expect(result).toEqual({
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        occurrenceDescription: `InitialDescription: The party decides to hide to avoid having to go on the hunt..\n\u200b\n\`\`\`They manage to evade the town watch and avoid going out on the hunt.\`\`\`\n`,
        occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Hunt!",
      });
      // @ts-ignore
      global.Math.random.mockRestore();
    });

    test('should handle successfully hide event with weapon found buff when initial roll is greater or equal to 19', async () => {
      const data = {
        difficultyModifier: 0,
        occurrenceDescription: 'InitialDescription: ',
        occurrenceTitle: `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`,
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      };
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(1);
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = await huntingPartyActions.huntingPartyHide(data);

      expect(result).toEqual({
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        occurrenceDescription: `InitialDescription: The party decides to hide to avoid having to go on the hunt..\n\u200b\n\`\`\`They manage to evade the town watch and avoid going out on the hunt. While hiding, XX found a TODOgetRandomWeapon someone had stashed away.\`\`\`\n`,
        occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Hunt!",
      });
      // @ts-ignore
      global.Math.random.mockRestore();
    });
  });

  describe('huntingPartyTrickOtherHunters', () => {
    test('should handle instigator caught and forced into exile event when initial roll is less than 2', async () => {
      const data = {
        difficultyModifier: 0,
        occurrenceDescription: 'InitialDescription: ',
        occurrenceTitle: `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`,
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      };
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = await huntingPartyActions.huntingPartyTrickOtherHunters(
        data
      );

      expect(result).toEqual({
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        occurrenceDescription: `InitialDescription: XX tries to avoid hunting party duty by YYY..\n\u200b\n\`\`\`However, XXX was caught trying to trick the others. They were beaten up and sent out of the hunt alone.\`\`\`\nThe party sets out to hunt the evil Bunny.\nHowever, they were not careful and the Bunny was able to ambush them!\n\u200b\n\`\`\`With lightning speed, the bunny hopped towards MockUser1Username, razor-sharp eggs flying in all directions.\nMockUser1Username stumbles backwards as the bunny's massive paw connects with their chest, knocking them to the ground and leaving them gasping for air. A final swipe and MockUser1Username is no more\`\`\`\n\`\`\`The bunny hops towards MockUser2Username, its beady eyes glowing with malevolence as it strikes with its sharp claws!\nWith a sickening crunch, the bunny's teeth sink into MockUser2Username's shoulder, tearing through flesh and muscle with terrifying ease. MockUser2Username lies in pieces on the ground\`\`\`\nThe bunny lives another day\n\u200b\n`,
        occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Hunt Ambush!",
      });
      // @ts-ignore
      global.Math.random.mockRestore();
    });

    test('should handle instigator not fooling and hunt goes ahead as normal event when initial roll is greater than or equal to 2 and less than 10', async () => {
      const data = {
        difficultyModifier: 0,
        occurrenceDescription: 'InitialDescription: ',
        occurrenceTitle: `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`,
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      };
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.25);
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = await huntingPartyActions.huntingPartyTrickOtherHunters(
        data
      );

      expect(result).toEqual({
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        occurrenceDescription: `InitialDescription: XX tries to avoid hunting party duty by YYY..\n\u200b\n\`\`\`However, XX was not convincing enough and had to join the hunt with the others.\`\`\`\nThe party sets out to hunt the evil Bunny.\nHowever, they were not careful and the Bunny was able to ambush them!\n\u200b\n\`\`\`With lightning speed, the bunny hopped towards MockUser1Username, razor-sharp eggs flying in all directions.\nMockUser1Username stumbles backwards as the bunny's massive paw connects with their chest, knocking them to the ground and leaving them gasping for air. A final swipe and MockUser1Username is no more\`\`\`\n\`\`\`The bunny hops towards MockUser2Username, its beady eyes glowing with malevolence as it strikes with its sharp claws!\nWith a sickening crunch, the bunny's teeth sink into MockUser2Username's shoulder, tearing through flesh and muscle with terrifying ease. MockUser2Username lies in pieces on the ground\`\`\`\nThe bunny lives another day\n\u200b\n`,
        occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Hunt Ambush!",
      });
      // @ts-ignore
      global.Math.random.mockRestore();
    });

    test('should handle instigator fooling others and hunt goes ahead as without them event when initial roll is greater than or equal to 10', async () => {
      const data = {
        difficultyModifier: 0,
        occurrenceDescription: 'InitialDescription: ',
        occurrenceTitle: `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`,
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      };
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(1);
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const result = await huntingPartyActions.huntingPartyTrickOtherHunters(
        data
      );

      expect(result).toEqual({
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        occurrenceDescription: `InitialDescription: XX tries to avoid hunting party duty by YYY..\n\u200b\n\`\`\`XX managed to fool the others and avoids having to go out on the hunt!\`\`\`\nThe party sets out to hunt the evil Bunny.\nHowever, they were not careful and the Bunny was able to ambush them!\n\u200b\n\`\`\`With lightning speed, the bunny hopped towards MockUser1Username, razor-sharp eggs flying in all directions.\nMockUser1Username stumbles backwards as the bunny's massive paw connects with their chest, knocking them to the ground and leaving them gasping for air. A final swipe and MockUser1Username is no more\`\`\`\n\`\`\`The bunny hops towards MockUser2Username, its beady eyes glowing with malevolence as it strikes with its sharp claws!\nWith a sickening crunch, the bunny's teeth sink into MockUser2Username's shoulder, tearing through flesh and muscle with terrifying ease. MockUser2Username lies in pieces on the ground\`\`\`\nThe bunny lives another day\n\u200b\n`,
        occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Hunt Ambush!",
      });
      // @ts-ignore
      global.Math.random.mockRestore();
    });
  });
});
