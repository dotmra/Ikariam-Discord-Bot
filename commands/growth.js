const ika = require('../custom_modules/ika.js');
const errorHandler = require('../custom_modules/error_handler.js');
const fs = require("fs");

exports.run = (client, message, args, guildConf) => {

  let argsArray = args.join(' ').split(', ');
  let scoreType = "Total Score";
  let dateNum = 30;
  args = [argsArray[0]]; // playerName

  if(argsArray.length == 2) {
    scoreType = argsArray[1];
  }
  if(argsArray.length == 3) {
    scoreType = argsArray[1];
    dateNum = [argsArray[2]].join('');
  }
  if(argsArray.length > 3) {
    return message.channel.send(`Correct usage: !growth <PlayerName>, [Score Category], [Time in Days]\n*(Score Category and Time in Days is optional. Without <> and [], remember the commas*`)
      .catch((err) => { return errorHandler.discordMessageError(message, err) });
  }

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
    return ika.getScoresInfo(region, ikariamWorld, playerObject, scoreType, dateNum);
  })

  .then(([scoreTypeItem, playerObject, scoreInfo]) => {
    if (!scoreTypeItem) {
      message.channel.send(`Could not find a score category with the name \`${scoreType}\`.`);
      throw new Error('Error handled: Could not find score category.');
    }

    embed_message = {
      embed: {
        title: `**${scoreTypeItem.friendlyName} Growth:** ${ika.other_emotes[playerObject.player.state]}`,
        color: 3447003,
        author: {name: '', icon_url: 'https://i.imgur.com/hasGiOH.png'},
        description: '',
        timestamp: Date.parse(scoreInfo[scoreInfo.length - 1].d),
        footer: {icon_url: 'https://i.imgur.com/MBLT0wt.png', text: 'ika-search.com'}
      }
    }
    embed_message.embed.author.name = `${playerObject.player.pseudo} ${playerObject.player.tag != null ? '('+playerObject.player.tag+')' : ''}`;

    let dateTime = new Date(Date.parse(scoreInfo[scoreInfo.length - 1].d)).getTime() - new Date(Date.parse(scoreInfo[0].d)).getTime();
    let growthDaysAmount = Math.ceil(dateTime / (1000 * 3600 * 24));
    let growthPercentage = ((scoreInfo[scoreInfo.length - 1].v - scoreInfo[0].v) / scoreInfo[0].v) * 100;
    let growthPoints = scoreInfo[scoreInfo.length - 1].v - scoreInfo[0].v;

    embed_message.embed.description += `\n**${scoreInfo[0].v.format()} -> ${scoreInfo[scoreInfo.length - 1].v.format()}**`; // 33,059 -> 75,878
    embed_message.embed.description += `\n**#${Math.abs(scoreInfo[0].r)} -> #${Math.abs(scoreInfo[scoreInfo.length - 1].r)}**`; // #77 -> #19
    embed_message.embed.description += `\n**${growthPercentage > 0 ? '+' : ''}${growthPoints.format()}** Points`; // -19,221 Points
    embed_message.embed.description += `\n**${growthPercentage > 0 ? '+' : ''}${growthPercentage.toFixed(2)}%** over ${growthDaysAmount} days`; // -99.82% over 89 days

    message.channel.send(embed_message)
      .catch((err) => { return errorHandler.discordMessageError(message, err) });
  })

  .catch((err) => {
    return errorHandler.handledError(err);
  });
}
