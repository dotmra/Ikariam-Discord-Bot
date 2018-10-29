exports.run = (server, bot, msg, args) => {

  const ika = require('../custom_modules/ika.js');

  Number.prototype.format = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  let island_coords = args[0].split(":");

  let x_coord = island_coords[0];
  let y_coord = island_coords[1];

  ika.verifyIslandCoordAndGetId(msg, x_coord, y_coord, server, (result) =>{
    if(!result) {
      msg.channel.send(`Could not find an island with the coordinations ${x_coord}:${y_coord}. Please try again.`);
    }
    else {
      let resource_emotes = ['', '<:wine:421131487992348683>', '<:marble:421131487996542977>', '<:crystal:421131487698747394>', '<:sulfur:471461212568289310>'];
      let wonder_emotes = ['', '<:forge:475413159583416350>', '<:hadesholygrove:475413418740809746>', '<:demetersgarden:475413432619761684>', '<:templeofathene:475413409085784095>', '<:templeofhermes:475413401179521031>', '<:aresstronghold:475413440387874826>', '<:poseidon:475413036253970442>', '<:colossus:475413055371608064>'];

      ika.getIslandInfo(msg, result.id, server, (islandObject) => {

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

        message_embed.embed.author.name = `[${x_coord}:${y_coord}] ${islandObject.island.name}, ${islandObject.cities.length}/17, ${inactive_count} inactive`;
        msg.channel.send(message_embed);

      });
    }
  });

}
