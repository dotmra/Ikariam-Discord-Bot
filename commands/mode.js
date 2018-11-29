const ika = require('../custom_modules/ika.js');
const errorHandler = require('../custom_modules/error_handler.js');

exports.run = (client, message, args, guildConf) => {

  if (!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send(`You need to be an \`Administrator\` in this Discord server to issue this command!`)
      .catch((err) => { return errorHandler.discordMessageError(message, err) });
  }

  if (args.length > 1) {
    return message.channel.send(`Incorrect usage, too many arguments. Correct usage: \`!mode (server or channel)\`, example: \`!mode server\`.`)
      .catch((err) => { return errorHandler.discordMessageError(message, err) });
  }

  if (args.join('').toLowerCase() == 'server' || args.join('').toLowerCase() == 'channel') {
    if (args.join('').toLowerCase() == 'server') {
      client.settings.set(message.guild.id, 'server', "botMode");
      return message.channel.send(`The bot is now in \`Server Mode\`.`)
        .catch((err) => { return errorHandler.discordMessageError(message, err) });
    }
    else {
      client.settings.set(message.guild.id, 'channel', "botMode");
      return message.channel.send(`The bot is now in \`Channel Mode\`.`)
        .catch((err) => { return errorHandler.discordMessageError(message, err) });
    }
  }
  else {
    return message.channel.send(`Invalid mode. You can only choose between \`Server Mode\` or \`Channel Mode\`, example: \`!mode server\`.`)
      .catch((err) => { return errorHandler.discordMessageError(message, err) });
  }

}
