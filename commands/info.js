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
    if (!playerObject.player.trader_score_secondary) {
      message.channel.send(`\`${args}\` is a registered player but ika-search does not yet have information about the scores.`);
      throw new Error('Error handled: Player registerd but no score information available.');
    }

    embed_message = {
      embed: {
        title: `**Player information:** ${ika.other_emotes[playerObject.player.state]}`,
        color: 3447003,
        author: {name: '', icon_url: 'https://i.imgur.com/hasGiOH.png'},
        description: ''
        + `**Total Score:** ${playerObject.player.score.format()} (#${playerObject.player.score_rank})`
        + `\n**Military Score:** ${playerObject.player.army_score_main.format()} (#${playerObject.player.army_score_main_rank})`
        + `\n**Gold Stock:** ${playerObject.player.trader_score_secondary.format()} (#${playerObject.player.trader_score_secondary_rank})`
        + `\n**Master Builders:** ${playerObject.player.building_score_main.format()} (#${playerObject.player.building_score_main_rank})`
        + `\n**Building Levels:** ${playerObject.player.building_score_secondary.format()} (#${playerObject.player.building_score_secondary_rank})`
        + `\n**Scientists:** ${playerObject.player.research_score_main.format()} (#${playerObject.player.research_score_main_rank})`
        + `\n**Levels of Research:** ${playerObject.player.research_score_secondary.format()} (#${playerObject.player.research_score_secondary_rank})`
        + `\n**Offensive Points:** ${playerObject.player.offense.format()} (#${playerObject.player.offense_rank})`
        + `\n**Defence Points:** ${playerObject.player.defense.format()} (#${playerObject.player.defense_rank})`
        + `\n**Trader:** ${playerObject.player.trade.format()} (#${playerObject.player.trade_rank})`
        + `\n**Resources:** ${playerObject.player.resources.format()} (#${playerObject.player.resources_rank})`
        + `\n**Donations:** ${playerObject.player.donations.format()} (#${playerObject.player.donations_rank})`
        + `\n**Capture Points:** ${playerObject.player.piracy.format()} (#${playerObject.player.piracy_rank})`,
        timestamp: Date.parse(playerObject.player.update_time),
        footer: {icon_url: 'https://i.imgur.com/MBLT0wt.png', text: 'ika-search.com'}
      }
    }
    embed_message.embed.author.name = `${playerObject.player.pseudo} ${playerObject.player.tag != null ? '('+playerObject.player.tag+')' : ''}`;

    return message.channel.send(embed_message);
  })

  .catch((err) => { return errorHandler.handledError(err) });
}
