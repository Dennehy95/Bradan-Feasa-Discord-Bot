const { EmbedBuilder } = require('discord.js');

module.exports = {
  createEmbedMessage (embedDetails) {
    const { embedColor, embedFooter = '\u200b', embedImage, embedThumbnail, fields = { name: '\u200b', value: '\u200b' }, messageDescription, messageTitle } = { ...embedDetails }

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