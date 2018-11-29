const ika = require('../custom_modules/ika.js');
const errorHandler = require('../custom_modules/error_handler.js');
const fs = require("fs");

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
      let argsArray = args.join(' ').split(', ');
      let playerName = [argsArray[0]];
      let scoreTypeArgs = ["Total Score"];
      let dateNum = 30;
      let dateType = 'DAY';

      if(argsArray.length == 1) {
        playerName = [argsArray[0]];
      }
      else if(argsArray.length == 2) {
        scoreTypeArgs = [argsArray[1]];
      }
      else if(argsArray.length == 3) {
        scoreTypeArgs = [argsArray[1]];
        dateNum = [argsArray[2]].join('');
        dateType = 'DAY';
      }
      else {
        message.channel.send(`Correct usage: !growth <PlayerName>, [Score Category], [Time in Days]\n*(Score Category and Time in Days is optional. Without <> and [], remember the commas*`)
          .catch((err) => { return errorHandler.discordMessageError(message, err) });
      }

      ika.verifyPlayerName(region, ikaServer, playerName, (result) => {

        if(!result) {
          message.channel.send(`Could not find a player with the name \`${args.join(' ')}\`. Please try again.`)
            .catch((err) => { return errorHandler.discordMessageError(message, err) });
        }
        else {

          let scoreType = '';
          let scoreTypeFriendly = '';
          fs.readFile('./data/scoreTypes.json', 'UTF-8', (err, data) => {
            if (err) throw err;
            let json_data = JSON.parse(data);

            scoreTypeItem = json_data.scoreCategories.find(item => item.aliases.includes(scoreTypeArgs.join(' ').toLowerCase()));

            if(!scoreTypeItem) {
              message.channel.send(`Could not find a score category with the name \`${scoreTypeArgs.join(' ')}\`. Please try again.`);
            }

            else {
              scoreType = scoreTypeItem.rawName;
              scoreTypeFriendly = scoreTypeItem.friendlyName;

              ika.getScoresInfo(region, ikaServer, result.id, scoreType, dateNum, dateType, (results) => {

                let daysAmount1 = new Date(Date.parse(results[results.length - 1].d)).getTime() - new Date(Date.parse(results[0].d)).getTime();
                let daysAmount2 = Math.ceil(daysAmount1 / (1000 * 3600 * 24));

                message_embed = {
                  embed: {
                    title: `**${scoreTypeFriendly} Information:**`,
                    color: 3447003,
                    author: {
                      name: '',
                      icon_url: 'https://i.imgur.com/hasGiOH.png'
                    },
                    description: '',
                    timestamp: Date.parse(results[results.length - 1].d),
                    footer: {
                      icon_url: 'https://i.imgur.com/MBLT0wt.png',
                      text: 'ika-search.com'
                    }
                  }
                }

                ika.getPlayerInfo(region, ikaServer, result.id, (playerObject) => {

                  message_embed.embed.author.name = `${result.pseudo}`;
                  if (playerObject.player.tag) {
                    message_embed.embed.author.name += ` (${playerObject.player.tag})`;
                  }

                  let growthPercentage = ((results[results.length - 1].v - results[0].v) / results[0].v) * 100;
                  let growthPoints = results[results.length - 1].v - results[0].v;

                  message_embed.embed.description += `\n**${results[0].v.format()} -> ${results[results.length - 1].v.format()}**`;
                  message_embed.embed.description += `\n**#${Math.abs(results[0].r)} -> #${Math.abs(results[results.length - 1].r)}**`;

                  if(growthPercentage < 0) { // if negative, else add a + in front
                    message_embed.embed.description += `\n**${growthPoints.format()}** Points`;
                    message_embed.embed.description += `\n**${growthPercentage.toFixed(2)}%** over ${daysAmount2} days`;
                  }
                  else {
                    message_embed.embed.description += `\n**+${growthPoints.format()}** Points`;
                    message_embed.embed.description += `\n**+${growthPercentage.toFixed(2)}%** over ${daysAmount2} days`;
                  }

                  message.channel.send(message_embed)
                    .catch((err) => { return errorHandler.discordMessageError(message, err) });

                });
              });

            }
          });

        }

      });
    }

  });

}
