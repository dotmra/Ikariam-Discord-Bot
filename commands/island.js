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
      let island_coords = args[0].split(":");
      let x_coord = island_coords[0];
      let y_coord = island_coords[1];

      ika.verifyIslandCoordAndGetId(x_coord, y_coord, (result) => {

        if(!result) {
          message.channel.send(`Could not find an island with the coordinations \`${x_coord}:${y_coord}\`. Please try again.`)
            .catch((err) => { return errorHandler.discordMessageError(message, err) });
        }

        else {
          ika.getIslandInfo(region, ikaServer, result.id, (islandObject) => {

            message_embed = {
              embed: {
                title: `**Island information:**`
                + `\nLvl ${islandObject.island.wonder_level} ${ika.wonder_emotes[islandObject.island.wonder_id]} Lvl ${islandObject.island.resource_level} ${ika.resource_emotes[islandObject.island.resource_id]} Lvl ${islandObject.island.wood_level} ${ika.resource_emotes[5]}`,
                color: 3447003,
                author: {
                  name: '',
                  icon_url: 'https://i.imgur.com/BwU5cbG.png'
                },
                description: '',
                footer: {
                  icon_url: 'https://i.imgur.com/MBLT0wt.png',
                  text: 'ika-search.com'
                }
              }
            }

            let inactive_count = 0;

            if (islandObject.cities.length == 0) {
              message_embed.embed.description += "No towns on this island.";
            }

            else {
              islandObject.cities.forEach((city) => {
                if(city.tag) {
                  message_embed.embed.description += `\n**${city.pseudo}**(${city.tag}) **-** ${city.name} (${city.level}) **-** ${city.army_score_main.format()} MS`;
                }
                else {
                  message_embed.embed.description += `\n**${city.pseudo}** **-** ${city.name} (${city.level}) **-** ${city.army_score_main.format()} MS`;
                }
                message_embed.embed.description += ` ${ika.other_emotes[city.state]}`;
              });
            }

            message_embed.embed.author.name = `[${x_coord}:${y_coord}] ${islandObject.island.name}, ${islandObject.cities.length}/17, ${inactive_count} inactive`;
            message.channel.send(message_embed)
              .catch((err) => { return errorHandler.discordMessageError(message, err) });

          });
        }
      });

    }
  });

}
