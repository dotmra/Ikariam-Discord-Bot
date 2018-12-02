const ika = require('../custom_modules/ika.js');
const errorHandler = require('../custom_modules/error_handler.js');

exports.run = (client, message, args, guildConf) => {

  ika.getIkariamRegionAndWorld(guildConf, message)
    .then(([mode, region, ikariamWorld]) => {
      if (!ikariamWorld) {
        message.channel.send(`You have not yet assigned an Ikariam world to use${mode == 'server' ? '' : ' in this channel'}. Use \`!ikariamworld\` to choose a world to use.`);
        throw new Error('Error handled: Ikariam world not assigned to channel/guild.');
      }
      return ika.verifyAllianceTagOrName(region, ikariamWorld, args);
    })

    .then(([alliance, region, ikariamWorld]) => {
      if(!alliance){
        message.channel.send(`Could not find an alliance with the name or tag \`${args.join(' ')}\`. Please try again.`);
        throw new Error('Error handled: Alliance not found with name or tag provided.');
      }
      return ika.getAllianceInfo(region, ikariamWorld, alliance.id);
    })

    .then(([allianceObject]) => {
      if (allianceObject.members.length == 0) {
        message.channel.send(`\`${args}\` is a registered alliance but ika-search does not yet have information about the alliance members.`);
        throw new Error('Error handled: Alliance registerd but no member information available.');
      }

      let embed_message = {
        embed: {
          title: `**Alliance information:**\n${allianceObject.ally.score.format()} (#${allianceObject.ally.score_rank}), ${allianceObject.members.length} Members`,
          color: 3447003,
          author: {name: '', icon_url: 'http://ika-search.com/style/images/alliance.png'},
          description: '',
          timestamp: Date.parse(allianceObject.ally.update_time),
          footer: {icon_url: 'https://i.imgur.com/MBLT0wt.png', text: 'ika-search.com'}
        }
      };
      embed_message.embed.author.name = `${allianceObject.ally.name} (${allianceObject.ally.tag})`;

      allianceObject.members.forEach((member) => {
        if (embed_message.embed.description.length > 1900) {
          delete embed_message.embed.timestamp;
          delete embed_message.embed.footer;
          message.channel.send(embed_message);
          embed_message.embed.description = '';
        }
        embed_message.embed.description += `\n**${member.pseudo}** (#${member.score_rank}) **-** ${member.army_score_main.format()} MS ${ika.other_emotes[member.state]}`;
      });

      if (!embed_message.embed.footer) {
        delete embed_message.embed.title;
        delete embed_message.embed.author;
      }

      embed_message.embed.timestamp = Date.parse(allianceObject.ally.update_time);
      embed_message.embed.footer = {icon_url: 'https://i.imgur.com/MBLT0wt.png', text: 'ika-search.com'};
      return message.channel.send(embed_message);
    })

    .catch((err) => { return errorHandler.handledError(err); });
};
