const errorHandler = require('../custom_modules/error_handler.js');

exports.run = (client, message) => {

  let message_embed = {
    embed: {
      color: 3447003,
      fields: [
        {
          name: 'Normal Commands',
          value: ''
          + '\n**!info** Player Name'
          + '\n**!find** Player Name'
          + '\n**!alliance** Alliance Name/Tag'
          + '\n**!island**  XX:YY'
          + '\n**!growth** Player Name, Score Category, Duration In Days (last 2 are optional)'
        },
        {
          name: 'Administrator Commands',
          value: ''
          + '\n**!region** Ikariam Region'
          + '\n**!mode** Server/Channel'
          + '\n**!ikariamworld** Ikariam World'
        },
        {
          name: 'Need help?',
          value: 'Contact \`7marre#7777\` on Discord'
        }
      ]
    }
  };

  message.channel.send(message_embed)
    .catch((err) => { return errorHandler.discordMessageError(message, err); });

};
