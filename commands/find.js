const ika = require('../custom_modules/ika.js');
const errorHandler = require('../custom_modules/error_handler.js');

exports.run = (client, message, args, guildConf) => {

  ika.getIkariamRegionAndWorld(guildConf, message)
  .then(([mode, region, ikariamWorld]) => {
    if (!ikariamWorld) {
      message.channel.send(`You have not yet assigned an Ikariam world to use${mode == 'server' ? '' : ' in this channel'}. Use \`!ikariamworld\` to choose a world to use.`);
      throw new Error('Error handled: Ikariam world not assigned to channel/guild.');
    }
    return ika.verifyPlayerName(region, ikariamWorld, args);
  })

  .then(([player, region, ikariamWorld]) => {
    if(!player){
      message.channel.send(`Could not find a player with the name \`${args.join(' ')}\`. Please try again.`);
      throw new Error('Error handled: Player not found with name provided.');
    }
    return ika.getPlayerInfo(region, ikariamWorld, player.id);
  })

  .then(([region, ikariamWorld, playerObject]) => {
    embed_message = {
      embed: {
        title:  `**Town information:** ${ika.other_emotes[playerObject.player.state]}`,
        color: 3447003,
        author: {name: '', icon_url: 'https://i.imgur.com/6a7pOOv.png'},
        description: '',
        footer: {icon_url: 'https://i.imgur.com/MBLT0wt.png', text: 'ika-search.com'}
      }
    }
    embed_message.embed.author.name = `${playerObject.player.pseudo} ${playerObject.player.tag != null ? '('+playerObject.player.tag+')' : ''}`;

    if (playerObject.cities.length == 0) {
      embed_message.embed.description += `No information about towns available for this player yet.`;
    }
    else {
      playerObject.cities.forEach((city) => {
        embed_message.embed.description += `\n**[${city.x}:${city.y}]** - ${city.name} (${city.level}) ${ika.wonder_emotes[city.wonder_id]}${ika.resource_emotes[city.resource_id]}`;
      });
    }

    return message.channel.send(embed_message);
  })

  .catch((err) => { return errorHandler.handledError(err) });
}
