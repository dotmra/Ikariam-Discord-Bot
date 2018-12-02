const errorHandler = require('../custom_modules/error_handler.js');

exports.run = (client, message, args) => {

  if (!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('You need to be an `Administrator` in this Discord server to issue this command!')
      .catch((err) => { return errorHandler.discordMessageError(message, err); });
  }

  if (args.join('').toLowerCase() != 'server' && args.join('').toLowerCase() != 'channel') {
    return message.channel.send('Invalid mode. You can only choose between `Server Mode` or `Channel Mode`, example: `!mode server`.')
      .catch((err) => { return errorHandler.discordMessageError(message, err); });
  }

  client.settings.set(message.guild.id, args.join('').toLowerCase() == 'server' ? 'server' : 'channel', 'botMode');
  return message.channel.send(`The bot is now in \`${args.join('').toLowerCase() == 'server' ? 'Server' : 'Channel'} Mode\`.`)
    .catch((err) => { return errorHandler.discordMessageError(message, err); });

};
