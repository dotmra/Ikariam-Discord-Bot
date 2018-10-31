exports.run = (server, client, message, args) => {

  const ika = require('../custom_modules/ika.js');

  ika.verifyPlayerName(message, server, args, (result) => {
    if(!result){
      message.channel.send(`Could not find a player with the name ${args.join(' ')}. Please try again.`);
    }
    else{
      let resource_emotes = ['', '<:wine:506517055579881472>', '<:marble:506517055739133952>', '<:crystal:506517055382618122>', '<:sulfur:506517055437275159>'];
      let wonder_emotes = ['', '<:forge:506517054963318815>', '<:hadesholygrove:506517054992678943>', '<:demetersgarden:506517055650922497>', '<:templeofathene:506517055583944714>', '<:templeofhermes:506517055613304833>', '<:aresstronghold:506517055030296606>', '<:poseidon:506517055252725781>', '<:colossus:506517055395069952>'];

      ika.getPlayerInfo(message, server, result.id, (playerObject) => {

        message_embed = {
          embed: {
            color: 3447003,
            author: {
              name: '',
              icon_url: 'https://i.imgur.com/6a7pOOv.png'
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

        if (playerObject.player.tag) {
          message_embed.embed.author.name = `${result.pseudo} (${playerObject.player.tag})`;
        }
        else {
          message_embed.embed.author.name = `${result.pseudo}`;
        }

        if(playerObject.player.state == 1){
          message_embed.embed.fields[0].name += ' <:vacation:506517055701385218>';
        }
        if(playerObject.player.state == 2){
          message_embed.embed.fields[0].name += ' <:inactive:506517055466635284>';
        }

        playerObject.cities.forEach((city) => {
          message_embed.embed.fields[0].value += `\n**[${city.x}:${city.y}]** - ${city.name} (${city.level}) ${wonder_emotes[city.wonder_id]}${resource_emotes[city.resource_id]}`;
        });

        message.channel.send(message_embed);

      });
    }
  });

}
