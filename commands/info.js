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
      ika.verifyPlayerName(region, ikaServer, args, (result) => {
        if(!result){
          message.channel.send(`Could not find a player with the name \`${args.join(' ')}\`. Please try again.`)
            .catch((err) => { return errorHandler.discordMessageError(message, err) });
        }
        else{
          ika.getPlayerInfo(region, ikaServer, result.id, (playerObject) => {

            player = playerObject.player;

            if (!player.trader_score_secondary) {
              return message.channel.send(`\`${args}\` is a registered player but ika-search does not yet have information about the scores.`)
                .catch((err) => { return errorHandler.discordMessageError(message, err) });
            }

            message_embed = {
              embed: {
                title: '**Player information:**',
                color: 3447003,
                author: {
                  name: '',
                  icon_url: 'https://i.imgur.com/hasGiOH.png'
                },
                description: ''
                + `**Total Score:** ${player.score.format()} (#${player.score_rank})`
                + `\n**Military Score:** ${player.army_score_main.format()} (#${player.army_score_main_rank})`
                + `\n**Gold Stock:** ${player.trader_score_secondary.format()} (#${player.trader_score_secondary_rank})`
                + `\n**Master Builders:** ${player.building_score_main.format()} (#${player.building_score_main_rank})`
                + `\n**Building Levels:** ${player.building_score_secondary.format()} (#${player.building_score_secondary_rank})`
                + `\n**Scientists:** ${player.research_score_main.format()} (#${player.research_score_main_rank})`
                + `\n**Levels of Research:** ${player.research_score_secondary.format()} (#${player.research_score_secondary_rank})`
                + `\n**Offensive Points:** ${player.offense.format()} (#${player.offense_rank})`
                + `\n**Defence Points:** ${player.defense.format()} (#${player.defense_rank})`
                + `\n**Trader:** ${player.trade.format()} (#${player.trade_rank})`
                + `\n**Resources:** ${player.resources.format()} (#${player.resources_rank})`
                + `\n**Donations:** ${player.donations.format()} (#${player.donations_rank})`
                + `\n**Capture Points:** ${player.piracy.format()} (#${player.piracy_rank})`,
                timestamp: Date.parse(player.update_time),
                footer: {
                  icon_url: 'https://i.imgur.com/MBLT0wt.png',
                  text: 'ika-search.com'
                }
              }
            }

            if (player.tag) {
              message_embed.embed.author.name = `${result.pseudo} (${player.tag})`;
            }
            else {
              message_embed.embed.author.name = `${result.pseudo}`;
            }

            message_embed.embed.title += ` ${ika.other_emotes[player.state]}`;

            message.channel.send(message_embed)
              .catch((err) => { return errorHandler.discordMessageError(message, err) });

          });
        }
      });
    }

  });

}
