const ika = require('../custom_modules/ika.js');
const errorHandler = require('../custom_modules/error_handler.js');

exports.run = (client, message, args, guildConf) => {

  if (!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send(`You need to be an \`Administrator\` in this Discord server to issue this command!`)
      .catch((err) => { return errorHandler.discordMessageError(message, err) });
  }

  let ikariamWorld;
  let commandMessage;
  let region;

  region = client.settings.get(message.guild.id, 'botRegion');

  ika.getIkariamRegionAndWorlds(region, (foundRegion, regionObject) => { // CHANGE 'us' TO THE ISO IN Guild Conf
    ikariamWorld = regionObject[2].find(item => item.toLowerCase() == args.join(' ').toLowerCase());
    if (!ikariamWorld) {
      commandMessage = `Could not find an Ikariam world with the name \`${args.join(' ')}\`. Available worlds: `;
      commandMessage += `${regionObject[2].join(', ')}.`;
      return message.channel.send(commandMessage)
        .catch((err) => { return errorHandler.discordMessageError(message, err) });
    }
    else {

      if (guildConf.botMode == 'server') {
        client.settings.set(message.guild.id, ikariamWorld, "serverModeWorld");
        return message.channel.send(`The Ikariam world \`${ikariamWorld}\` will now be used for commands in all channels.`)
          .catch((err) => { return errorHandler.discordMessageError(message, err) });
      }
      else if (guildConf.botMode == 'channel') {
        guildConf.channelModeWorlds[message.channel.id] = ikariamWorld;
        client.settings.set(message.guild.id, guildConf.channelModeWorlds, "channelModeWorlds");
        return message.channel.send(`The Ikariam world \`${ikariamWorld}\` will now be used for commands in channel \`#${message.channel.name}\`.`)
          .catch((err) => { return errorHandler.discordMessageError(message, err) });
      }
      else {
        errorHandler.customError('Could not determine if Guild has Server Mode or Channel Mode. Message:\n' + message.content);
        return message.channel.send(`Unable to determine if this Discord server uses \`Server Mode\` or \`Channel Mode\`. Do \`!mode\`.`)
          .catch((err) => { return errorHandler.discordMessageError(message, err) });
      }
    }
  });


}
