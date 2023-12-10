const _ = require('lodash');
const {
  selectRandomMessage,
} = require('../../../../../src/Events/Client/SeasonalEvents/Easter/EasterEvilBunny/easterEvilBunnyHuntUtils');

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
