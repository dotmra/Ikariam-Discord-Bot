const errorHandler = require('../custom_modules/error_handler.js');

exports.run = (client, message, args) => {

  message_embed = {
    embed: {
      color: 3447003,
      fields: [
        {
          name: "Noraml Commands",
          value: ""
          + "\n**!info** <Player Name>"
          + "\n**!find** <Player Name>"
          + "\n**!island**  <XX:YY>"
          + "\n**!growth** <Player Name>, [Score Category], [Duration In Days]"
        },
        {
          name: "Administrator Commands",
          value: ""
          + "\n**!region** <Ikariam Region>"
          + "\n**!mode** <Server/Channel>"
          + "\n**!ikariamworld** <Ikariam World>"
        },
        {
          name: "Need help?",
          value: "Contact \`7marre#7777\` on Discord"
        }
      ]
    }
  }

  message.channel.send(message_embed)
    .catch((err) => { return errorHandler.discordMessageError(message, err) });

}
