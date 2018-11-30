const fs = require("fs");
const errorHandler = require('../custom_modules/error_handler.js');

module.exports = (client, guild) => {
  console.log(`The bot has joined a server, ID: ${guild.id}, NAME: ${guild.name}, MEMBERS: ${guild.memberCount}`);

  let filteredChannels = guild.channels.filter(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));

  let welcomeMessage;

  fs.readFile('./data/welcomeMessage.txt', 'UTF-8', (err, data) => {
    if (err) return errorHandler.customError('Failed to read file ./data/welcomeMessage.txt, guildCreate.js line 10');
    welcomeMessage = data;

    if (filteredChannels) {
      let sortedChannels = filteredChannels.sort((chan1, chan2) => {return chan1.position < chan2.position ? -1 : 1});
      sortedChannels.first().send(welcomeMessage)
        .catch((err) => { return errorHandler.otherError(err) });
      return console.log(`Successfully sent guildCreate message in guild '${guild.name}' in channel '#${sortedChannels.first().name}'`);
    }

    else {
      return console.log(`Failed to send guildCreate message in guild '${guild.name}' (${guild.id}) (Missing SEND_MESSAGES permission in all channels)`);
    }
  });

}
