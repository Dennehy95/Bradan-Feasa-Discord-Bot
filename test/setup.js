const { Client, Message } = require('discord.js');

global.client = new Client();

global.mockMessage = (content) => {
  return new Message(client, {
    id: '123456789',
    content: content,
    author: {
      id: '987654321',
      username: 'testuser',
    },
    channel: {
      id: '123456789',
      send: jest.fn(),
    },
  }, client);
};