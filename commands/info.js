exports.run = (server, bot, msg, args) => {

  const ika = require('../custom_modules/ika.js');

  Number.prototype.format = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  ika.verifyPlayerName(msg, args, server, (result) => {
    if(!result){
      msg.channel.send(`Could not find a player with the name ${args.join(' ')}. Please try again.`);
    }
    else{
      ika.getPlayerInfo(msg, result.id, server, (playerObject) => {

        player = playerObject.player;

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

        if(player.id == 890) {
          message_embed.embed.author.name += ' aka the Best Player';
        }

        if(player.id == 599) {
          message_embed.embed.author.name += ' aka the Bully';
        }

        if(player.id == 4804) {
          message_embed.embed.author.name += ' aka the Beast';
        }

        if(player.id == 458) {
          message_embed.embed.author.name += ' aka the Sleepless Pirate';
        }

        if(player.state == 1){
          message_embed.embed.fields[0].name += ' <:vacation:421152426427416578>';
        }
        if(player.state == 2){
          message_embed.embed.fields[0].name += ' <:inactive:476253259275960320>';
        }

        msg.channel.send(message_embed);

      });
    }
  });

}
