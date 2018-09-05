exports.run = (client, msg, args) => {

  const ika = require('../custom_modules/ika.js');

  ika.verifyPlayerName(args, (result) => {
    if(!result){
      msg.channel.send('Could not find a player with the name ' + args.join(' ') + '. Please try again.');
    }
    else{
      //msg.channel.send(result.pseudo);
      //msg.channel.send(result.id);
      let preset = {};
      let resources = ['', 'Wine', 'Marble', 'Crystal', 'Sulfur'];
      let resource_emotes = ['', '<:wine:421131487992348683>', '<:marble:421131487996542977>', '<:crystal:421131487698747394>', '<:sulfur:471461212568289310>'];
      let wonder_emotes = ['', '<:forge:475413159583416350>', '<:hadesholygrove:475413418740809746>', '<:demetersgarden:475413432619761684>', '<:templeofathene:475413409085784095>', '<:templeofhermes:475413401179521031>', '<:aresstronghold:475413440387874826>', '<:poseidon:475413036253970442>', '<:colossus:475413055371608064>'];
      ika.getTr((template) => {
        preset = template;
      });

      ika.getPlayerInfo(result.id, (playerObject) => {
        console.log(playerObject);

        message_embed = {
          embed: {
            color: 3447003,
            author: {
              name: result.pseudo,
              icon_url: 'https://i.imgur.com/7ZZO9nb.png'
            },
            fields: [{
                name: '**Town information:**',
                value: ''
              }
            ],
            timestamp: Date.parse(playerObject.player.update_time),
            footer: {
              icon_url: 'https://i.imgur.com/MBLT0wt.png',
              text: 'ika-search.com'
            }
          }
        }

        playerObject.cities.forEach((city) => {
          message_embed.embed.fields[0].value += '\n**[' + city.x + ':' + city.y + ']** - ' + city.name + ' (' + city.level + ') '
          + wonder_emotes[city.wonder_id] + resource_emotes[city.resource_id];
        });

        msg.channel.send(message_embed);

      });
    }
  });

}
