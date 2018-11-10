const ika = require('../custom_modules/ika.js');

exports.run = (client, message, args, defaultSettings) => {

  const guildConf = client.settings.ensure(message.guild.id, defaultSettings);

  ika.getGuildServer(guildConf, message, (ikaServer) => {

    if (!ikaServer) {
      return message.channel.send("This server does not have an Ikariam server assigned. Use \`!globalserver <Ikariam Server Name>\` to assign an Ikariam server for the bot to use or \`!globalserver off\` to turn off global server.").catch((err) => {
        if(err != "DiscordAPIError: Missing Permissions"){
          return console.error(err);
        }
        return console.log(`Command !find: No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
      });
    }

    else {
      let island_coords = args[0].split(":");
      let x_coord = island_coords[0];
      let y_coord = island_coords[1];

      ika.verifyIslandCoordAndGetId(ikaServer, x_coord, y_coord, (result) => {

        if(!result) {
          message.channel.send(`Could not find an island with the coordinations \`${x_coord}:${y_coord}\`. Please try again.`).catch((err) => {
            if(err != "DiscordAPIError: Missing Permissions"){
              return console.error(err);
            }
            return console.log(`Command !island: No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
          });
        }

        else {
          ika.getIslandInfo(ikaServer, result.id, (islandObject) => {

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
                if(city.state == 1){
                  message_embed.embed.description += ' <:vacation:421152426427416578>';
                }
                if(city.state == 2){
                  message_embed.embed.description += ' <:inactive:476253259275960320>';
                  inactive_count++;
                }
              });
            }

            message_embed.embed.author.name = `[${x_coord}:${y_coord}] ${islandObject.island.name}, ${islandObject.cities.length}/17, ${inactive_count} inactive`;
            message.channel.send(message_embed).catch((err) => {
              if(err != "DiscordAPIError: Missing Permissions"){
                return console.error(err);
              }
              return console.log(`Command !island: No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
            });

          });
        }
      });

    }
  });

}
