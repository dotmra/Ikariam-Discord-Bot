exports.run = (server, bot, msg, args) => {

  const ika = require('../custom_modules/ika.js');

  Number.prototype.format = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  let island_coords = args[0].split(":");

  let x_coord = island_coords[0];
  let y_coord = island_coords[1];

  ika.verifyIslandCoordAndGetId(msg, server, x_coord, y_coord, (result) =>{
    if(!result) {
      msg.channel.send(`Could not find an island with the coordinations ${x_coord}:${y_coord}. Please try again.`);
    }
    else {
      let resource_emotes = ['', '<:wine:506517055579881472>', '<:marble:506517055739133952>', '<:crystal:506517055382618122>', '<:sulfur:506517055437275159>'];
      let wonder_emotes = ['', '<:forge:506517054963318815>', '<:hadesholygrove:506517054992678943>', '<:demetersgarden:506517055650922497>', '<:templeofathene:506517055583944714>', '<:templeofhermes:506517055613304833>', '<:aresstronghold:506517055030296606>', '<:poseidon:506517055252725781>', '<:colossus:506517055395069952>'];

      ika.getIslandInfo(msg, server, result.id, (islandObject) => {

        message_embed = {
          embed: {
            color: 3447003,
            author: {
              name: '',
              icon_url: 'https://i.imgur.com/BwU5cbG.png'
            },
            fields: [{
                name: `**Island information:** ${wonder_emotes[islandObject.island.wonder_id]}${resource_emotes[islandObject.island.resource_id]}`,
                value: ''
              }
            ],
            footer: {
              icon_url: 'https://i.imgur.com/MBLT0wt.png',
              text: 'ika-search.com'
            }
          }
        }

        let inactive_count = 0;

        if (islandObject.cities.length == 0) {
          message_embed.embed.fields[0].value += "No towns on this island."
        }
        else {
          islandObject.cities.forEach((city) => {
            if(city.tag) {
              message_embed.embed.fields[0].value += `\n**${city.pseudo}**(${city.tag}) **-** ${city.name} (${city.level}) **-** ${city.army_score_main.format()} MS`;
            }
            else {
              message_embed.embed.fields[0].value += `\n**${city.pseudo}** **-** ${city.name} (${city.level}) **-** ${city.army_score_main.format()} MS`;
            }

            if(city.state == 2) {inactive_count++;}

            // Discord form body can not be over 1024 chars and adding this will exceed that limit on many islands making the bot not send a message.
            /*if(city.state == 1){
              message_embed.embed.fields[0].value += ' <:vacation:421152426427416578>';
            }
            if(city.state == 2){
              message_embed.embed.fields[0].value += ' <:inactive:476253259275960320>';
            }*/
          });
        }

        message_embed.embed.author.name = `[${x_coord}:${y_coord}] ${islandObject.island.name}, ${islandObject.cities.length}/17, ${inactive_count} inactive`;
        msg.channel.send(message_embed);

      });
    }
  });

}
