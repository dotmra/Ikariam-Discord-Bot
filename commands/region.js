const ika = require('../custom_modules/ika.js');
const errorHandler = require('../custom_modules/error_handler.js');

exports.run = (client, message, args, guildConf) => {

  if (!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send(`You need to be an \`Administrator\` in this Discord server to issue this command!`)
      .catch((err) => { return errorHandler.discordMessageError(message, err) });
  }

  let commandMessage;

  ika.getIkariamRegionAndWorlds(args.join(' '))
  .then(([foundRegion, regionObject, region]) => {
    if(!foundRegion){
      commandMessage = '**Available Ikariam Regions:**\n';
      regionObject.forEach((region) => {
        commandMessage += `:flag_${region[0] == 'en' ? 'gb' : region[0]}: \`${region[0]}\` - **${region[1]}**\n`;
      });
      commandMessage += '\nInvalid region. Pick a region from the list above, for example `!region en` or `!region United Kingdom`.'
      message.channel.send(commandMessage);
      throw new Error('Error handled: Could not find Ikariam region with name provided.');
    }
    else {
      commandMessage = `You chose the :flag_${region[0] == 'en' ? 'gb' : region[0]}: \`${region[0]}\` region. Available worlds: `;
      commandMessage += `\`${region[2].join('\`, \`')}\`. Use \`!ikariamworld\` to choose what Ikariam world to use for commands.`;
      client.settings.set(message.guild.id, region[0], "botRegion");
      return message.channel.send(commandMessage);
    }
  })

  .catch((err) => { return errorHandler.handledError(err) });

}
