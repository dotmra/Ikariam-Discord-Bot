exports.run = (client, message, args) => {

  const ika = require('../custom_modules/ika.js');

  Number.prototype.format = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  let ikaServer = "";

  if (client.settings.get(message.guild.id, "commandMode") === "ALL") {
    if (client.settings.get(message.guild.id, "commandModeAllServer").length != 0) {
      ikaServer = client.settings.get(message.guild.id, "commandModeAllServer");
    }
    else {
      return message.channel.send("This server does not have an Ikariam server assigned. Use \`!globalserver <Ikariam Server Name>\` to assign an Ikariam server for the bot to use or \`!globalserver off\` to turn off global server.").catch((err) => {
        if(err != "DiscordAPIError: Missing Permissions"){
          return console.error(err);
        }
        return console.log(`Command !info: No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
      });
    }
  }
  else {
    if (!client.settings.get(message.guild.id, "channelServers").hasOwnProperty(message.channel.id)) {
      return message.channel.send("This channel does not have an Ikariam server assigned. Use \`!addserver <Ikariam Server Name>\` to assign an Ikariam server for the bot to use in this channel.").catch((err) => {
        if(err != "DiscordAPIError: Missing Permissions"){
          return console.error(err);
        }
        return console.log(`Command !info: No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
      });
    }
    else {
      ikaServer = client.settings.get(message.guild.id, "channelServers")[message.channel.id];
    }
  }

  ika.verifyPlayerName(ikaServer, args, (result) => {
    if(!result){
      message.channel.send(`Could not find a player with the name \`${args.join(' ')}\`. Please try again.`).catch((err) => {
        if(err != "DiscordAPIError: Missing Permissions"){
          return console.error(err);
        }
        return console.log(`Command !info: No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
      });
    }
    else{
      ika.getPlayerInfo(ikaServer, result.id, (playerObject) => {

        player = playerObject.player;

        if (!player.trader_score_secondary) {
          return message.channel.send(`\`${args}\` is a registered player but ika-search does not yet have information about the scores.`).catch((err) => {
            if(err != "DiscordAPIError: Missing Permissions"){
              return console.error(err);
            }
            return console.log(`Command !info: No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
          });
        }

        message_embed = {
          embed: {
            color: 3447003,
            author: {
              name: '',
              icon_url: 'https://i.imgur.com/hasGiOH.png'
            },
            fields: [{
                name: '**Player information:**',
                value: ''
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
                + `\n**Capture Points:** ${player.piracy.format()} (#${player.piracy_rank})`
              }
            ],
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

        message.channel.send(message_embed).catch((err) => {
          if(err != "DiscordAPIError: Missing Permissions"){
            return console.error(err);
          }
          return console.log(`Command !info: No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
        });

      });
    }
  });

}
