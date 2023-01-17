const { EmbedBuilder } = require('discord.js');

module.exports = {
  createEmbedMessage (embedDetails) {
    const { embedColor, embedFooter, embedImage, embedThumbnail, fields, messageDescription, messageTitle } = { ...embedDetails }

    return [
      new EmbedBuilder()
        .setColor(embedColor)
        .setFooter({ text: embedFooter })
        .setImage(embedImage)
        .setThumbnail(embedThumbnail)
        .setTitle(messageTitle)
        .setDescription(messageDescription)
        .setFields(fields)
    ]
  }
}