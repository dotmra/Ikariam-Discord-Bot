const ika = require('../custom_modules/ika.js');
const errorHandler = require('../custom_modules/error_handler.js');

exports.run = (client, message, args, guildConf) => {

  let island_coords = args[0].split(":");
  let x_coord = island_coords[0], y_coord = island_coords[1];

  ika.getIkariamRegionAndWorld(guildConf, message)
  .then(([mode, region, ikariamWorld]) => {
    if (!ikariamWorld) {
      message.channel.send(`You have not yet assigned an Ikariam world to use${mode == 'server' ? '' : ' in this channel'}. Use \`!ikariamworld\` to choose a world to use.`);
      throw new Error('Error handled: Ikariam world not assigned to channel/guild.');
    }
    return ika.verifyIslandCoordAndGetId(region, ikariamWorld, x_coord, y_coord);
  })

  .then(([region, ikariamWorld, island]) => {
    if(!island) {
      message.channel.send(`Could not find an island with the coordinations \`${x_coord}:${y_coord}\`. Please try again.`);
      throw new Error('Error handled: Could not find an island with coordinations provided.');
    }
    return ika.getIslandInfo(region, ikariamWorld, island.id);
  })

  .then((islandObject) => {
    embed_message = {
      embed: {
        title: `**Island information:**\nLvl ${islandObject.island.wonder_level} ${ika.wonder_emotes[islandObject.island.wonder_id]} `
        + `Lvl ${islandObject.island.resource_level} ${ika.resource_emotes[islandObject.island.resource_id]} Lvl ${islandObject.island.wood_level} ${ika.resource_emotes[5]}`,
        color: 3447003,
        author: {name: '', icon_url: 'https://i.imgur.com/BwU5cbG.png'},
        description: '',
        footer: {icon_url: 'https://i.imgur.com/MBLT0wt.png', text: 'ika-search.com'}
      }
    }
    embed_message.embed.author.name = `[${x_coord}:${y_coord}] ${islandObject.island.name}, ${islandObject.cities.length}/17`;

    if (islandObject.cities.length == 0) {
      embed_message.embed.description += "No towns on this island.";
    }

    else {
      islandObject.cities.forEach((city) => {
        embed_message.embed.description += `\n**${city.pseudo}** ${city.tag != null ? '('+city.tag+')' : ''} **-** ${city.name} (${city.level})`
        + ` **-** ${city.army_score_main != null ? '('+city.army_score_main.format()+')' : ''} MS ${ika.other_emotes[city.state]}`;
      });
    }

    return message.channel.send(embed_message);
  })

  .catch((err) => { return errorHandler.handledError(err) });
}
