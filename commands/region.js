const ika = require('../custom_modules/ika.js');
const errorHandler = require('../custom_modules/error_handler.js');

exports.run = (client, message, args, guildConf) => {

  if (!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send(`You need to be an \`Administrator\` in this Discord server to issue this command!`)
      .catch((err) => { return errorHandler.discordMessageError(message, err) });
  }

  ika.getIkariamRegionAndWorlds(args.join(' '), (foundRegion, regionObject) => {

    let commandMessage;

    if(!foundRegion){
      commandMessage = '**Available Ikariam Regions:**\n';
      regionObject.forEach((region) => {
        if (region[0] == 'en') {
          commandMessage += `:flag_gb: \`${region[0]}\` - **${region[1]}**\n`;
        }
        else {
          commandMessage += `:flag_${region[0]}: \`${region[0]}\` - **${region[1]}**\n`;
        }
      });
      commandMessage += '\nPick a region from the list above, for example `!region en` or `!region United Kingdom`.'
      return message.channel.send(commandMessage);
    }

    else {
      if (regionObject[0] == 'en') {
        console.log(regionObject);
        commandMessage = `You chose the :flag_gb: \`${regionObject[0]}\` region. Available worlds: `;
        commandMessage += `${regionObject[2].join(', ')}. Use \`!ikariamworld\` to choose what Ikariam world to use for commands.`;
      }
      else {
        console.log(regionObject);
        commandMessage = `You chose the :flag_${regionObject[0]}: \`${regionObject[0]}\` region. Available worlds: `;
        commandMessage += `${regionObject[2].join(', ')}. Use \`!ikariamworld\` to choose what Ikariam world to use for commands.`;
      }
      client.settings.set(message.guild.id, regionObject[0], "botRegion");
      return message.channel.send(commandMessage);
    }
  });

}
