exports.run = (server, client, message, args) => {

  const ika = require('../custom_modules/ika.js');
  const fs = require("fs");

  Number.prototype.format = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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
    message.channel.send(`Correct usage: !growth <PlayerName>, [Score Category], [Time in Days]\n*(Score Category and Time in Days is optional. Without <> and [], remember the commas*`);
  }

  ika.verifyPlayerName(message, server, playerName, (result) => {

    if(!result) {
      message.channel.send(`Could not find a player with the name ${args.join(' ')}. Please try again.`);
    }
    else {

      let scoreType = '';
      let scoreTypeFriendly = '';
      fs.readFile('./data/scoreTypes.json', 'UTF-8', (err, data) => {
        if (err) throw err;
        let json_data = JSON.parse(data);

        let scoreTypeItem = json_data.scoreType.find(item => item.name == scoreTypeArgs.join(' ').toLowerCase());

        if(!scoreTypeItem) {
          scoreTypeItem = json_data.scoreType.find(item => item.alias1 == scoreTypeArgs.join(' ').toLowerCase());
        }
        if(!scoreTypeItem) {
          scoreTypeItem = json_data.scoreType.find(item => item.alias2 == scoreTypeArgs.join(' ').toLowerCase());
        }
        if(!scoreTypeItem) {
          scoreTypeItem = json_data.scoreType.find(item => item.alias3 == scoreTypeArgs.join(' ').toLowerCase());
        }
        if(!scoreTypeItem) {
          scoreTypeItem = json_data.scoreType.find(item => item.alias4 == scoreTypeArgs.join(' ').toLowerCase());
        }
        if(!scoreTypeItem) {
          message.channel.send(`Could not find a score category with the name ${scoreTypeArgs.join(' ')}. Please try again.`);
        }
        else {
          scoreType = scoreTypeItem.name;
          scoreTypeFriendly = scoreTypeItem.friendlyName;

          ika.getScoresInfo(message, server, result.id, scoreType, dateNum, dateType, (results) => {

            let daysAmount1 = new Date(Date.parse(results[results.length - 1].d)).getTime() - new Date(Date.parse(results[0].d)).getTime();
            let daysAmount2 = Math.ceil(daysAmount1 / (1000 * 3600 * 24));

            message_embed = {
              embed: {
                color: 3447003,
                author: {
                  name: '',
                  icon_url: 'https://i.imgur.com/hasGiOH.png'
                },
                fields: [{
                    name: `**${scoreTypeFriendly} Information:**`,
                    value: ''
                  }
                ],
                timestamp: Date.parse(results[results.length - 1].d),
                footer: {
                  icon_url: 'https://i.imgur.com/MBLT0wt.png',
                  text: 'ika-search.com'
                }
              }
            }

            ika.getPlayerInfo(message, server, result.id, (playerObject) => {
              if (playerObject.player.tag) {
                message_embed.embed.author.name = `${result.pseudo} (${playerObject.player.tag})`;
              }
              else {
                message_embed.embed.author.name = `${result.pseudo}`;
              }

              let growthPercentage = ((results[results.length - 1].v - results[0].v) / results[0].v) * 100;
              let growthPoints = results[results.length - 1].v - results[0].v;

              message_embed.embed.fields[0].value += `\n**${results[0].v.format()} -> ${results[results.length - 1].v.format()}**`;
              message_embed.embed.fields[0].value += `\n**#${Math.abs(results[0].r)} -> #${Math.abs(results[results.length - 1].r)}**`;

              if(growthPercentage < 0) {
                message_embed.embed.fields[0].value += `\n**${growthPoints.format()}** Points`;
                message_embed.embed.fields[0].value += `\n**${growthPercentage.toFixed(2)}%** over ${daysAmount2} days`;
              }
              else {
                message_embed.embed.fields[0].value += `\n**+${growthPoints.format()}** Points`;
                message_embed.embed.fields[0].value += `\n**+${growthPercentage.toFixed(2)}%** over ${daysAmount2} days`;
              }

              results.forEach((result) => {
                let date = new Date(result.d);
                let points = result.v;
                let position = result.r;
              });

              message.channel.send(message_embed);

            });
          });

        }
      });

    }

  });
}
