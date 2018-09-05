exports.run = (bot, msg, args) => {

  const ika = require('../custom_modules/ika.js');

  Number.prototype.format = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  ika.verifyPlayerName(args, (result) => {
    if(!result){
      msg.channel.send('Could not find a player with the name ' + args.join(' ') + '. Please try again.');
    }
    else{
      ika.getPlayerInfo(result.id, (playerObject) => {

        player = playerObject.player;

        message_embed = {
          embed: {
            color: 3447003,
            author: {
              name: result.pseudo,
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

        msg.channel.send(message_embed);

      });
    }
  });

}
