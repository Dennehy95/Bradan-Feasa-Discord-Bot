const mongoose = require("mongoose");
const Guild = require("../Schemas/guild");
const { PermissionsBitField } = require('discord.js');

module.exports = {
  generateNewGuildDBEntry: async (guild) => {
    console.log('TODO: check if guild.guildId is real')
    return await new Guild({
      _id: new mongoose.Types.ObjectId(),
      guildId: guild.guildId,
      guildName: guild.name,
      moviesData: {
        genreList: [],
        movieList: [],
      }
    })
  },

  getAllowedChannels: ({ client, server, channelTypes = ['text'] }) => {
    let channelTypesBitFields = []
    if (channelTypes.includes('text')) {
      channelTypesBitFields.push(0)
    }

    // console.log(client.channels.cache)
    const filteredChannels = server.channels.cache.filter(channel => {
      return (
        channelTypesBitFields.includes(channel.type) &&
        channel.permissionsFor(client.user).has(PermissionsBitField.Flags.ReadMessageHistory) &&
        channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) &&
        channel.permissionsFor(client.user).has(PermissionsBitField.Flags.ViewChannel)
      )
    })

    return filteredChannels
  }
}