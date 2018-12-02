/*eslint no-unused-vars: 0*/
const ika = require('../custom_modules/ika.js');
const errorHandler = require('../custom_modules/error_handler.js');
exports.run = (client, message, args, guildConf) => {

  if (!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('You need to be an `Administrator` in this Discord server to issue this command!')
      .catch((err) => { return errorHandler.discordMessageError(message, err); });
  }

  let ikariamWorld;
  let region;

  region = client.settings.get(message.guild.id, 'botRegion');

  ika.getIkariamRegionAndWorlds(region)
    .then(([ikariamRegionsObject, region]) => {
      ikariamWorld = region[2].find(item => item.toLowerCase() == args.join(' ').toLowerCase());
      if (!ikariamWorld) {
        message.channel.send(`Could not find an Ikariam world with the name \`${args.join(' ')}\`. Available worlds: ${region[2].join(', ')}.`);
        throw new Error('Error handled: Could not find Ikariam world with name provided.');
      }

      else {
        if (guildConf.botMode == 'server') {
          client.settings.set(message.guild.id, ikariamWorld, 'serverModeWorld');
          return message.channel.send(`The Ikariam world \`${ikariamWorld}\` will now be used for commands in all channels.`);
        }
        else if (guildConf.botMode == 'channel') {
          guildConf.channelModeWorlds[message.channel.id] = ikariamWorld;
          client.settings.set(message.guild.id, guildConf.channelModeWorlds, 'channelModeWorlds');
          return message.channel.send(`The Ikariam world \`${ikariamWorld}\` will now be used for commands in channel \`#${message.channel.name}\`.`);
        }
        else {
          errorHandler.customError(`Could not determine if Guild has Server Mode or Channel Mode. Message:\n ${message.content}`);
          message.channel.send('Unable to determine if this Discord server uses `Server Mode` or `Channel Mode`. Please do \`!mode\` to set the mode.');
          throw new Error('Error handled: Unable to determine if Discord server uses Server Mode or Channel Mode.');
        }
      }

    })

    .catch((err) => { return errorHandler.handledError(err); });

};
