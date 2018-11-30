const ika = require('../custom_modules/ika.js');
const errorHandler = require('../custom_modules/error_handler.js');

exports.run = (client, message, args, guildConf) => {

  ika.getGuildServer(guildConf, message, (mode, ikaServer) => {

    let region = client.settings.get(message.guild.id, 'botRegion');

    if (!ikaServer) {
      if (mode == 'server') {
        return message.channel.send(`You have not yet assigned an Ikariam world to use. Use \`!ikariamworld\` to choose a world to use.`)
          .catch((err) => { return errorHandler.discordMessageError(message, err) });
      }
      else {
        return message.channel.send(`You have not yet assigned an Ikariam world to use in this channel. Use \`!ikariamworld\` to choose a world to use.`)
          .catch((err) => { return errorHandler.discordMessageError(message, err) });
      }
    }

    else {
      ika.verifyPlayerName(region, ikaServer, args)
      .then((result) => {
        if(!result){
          message.channel.send(`Could not find a player with the name \`${args.join(' ')}\`. Please try again.`)
            .catch((err) => { return errorHandler.discordMessageError(message, err) });
        }
        else{
          ika.getPlayerInfo(region, ikaServer, result.id)
          .then((playerObject) => {

            message_embed = {
              embed: {
                title:  `**Town information:**`,
                color: 3447003,
                author: {
                  name: '',
                  icon_url: 'https://i.imgur.com/6a7pOOv.png'
                },
                description: '',
                footer: {
                  icon_url: 'https://i.imgur.com/MBLT0wt.png',
                  text: 'ika-search.com'
                }
              }
            }

            if (playerObject.player.tag) {
              message_embed.embed.author.name = `${result.pseudo} (${playerObject.player.tag})`;
            }
            else {
              message_embed.embed.author.name = `${result.pseudo}`;
            }

            if (playerObject.cities.length == 0) {
              return message.channel.send(`\`${args}\` is a registered player but ika-search does not yet have information about the town locations.`)
                .catch((err) => { return errorHandler.discordMessageError(message, err) });
            }

            playerObject.cities.forEach((city) => {
              message_embed.embed.description += `\n**[${city.x}:${city.y}]** - ${city.name} (${city.level}) ${ika.wonder_emotes[city.wonder_id]}${ika.resource_emotes[city.resource_id]}`;
            });

            message_embed.embed.title += ` ${ika.other_emotes[playerObject.player.state]}`;

            return message.channel.send(message_embed)
              .catch((err) => { return errorHandler.discordMessageError(message, err) });

          })
          .catch((err) => {
            return errorHandler.otherError(err);
          });
        }
      })
      .catch((err) => {
        return errorHandler.otherError(err);
      });
    }

  });


}
