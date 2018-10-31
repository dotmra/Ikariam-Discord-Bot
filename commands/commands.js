exports.run = (message, args) => {

  message_embed = {
    embed: {
      color: 3447003,
      fields: [
        {
          name: "Available Commands",
          value: ""
          + "\n**!info** <Player Name>"
          + "\n**!find** <Player Name>"
          + "\n**!island**  <XX:YY>"
          + "\n**!growth** <Player Name>"
          + "\n**!growth** <Player Name>, <Score Category>, <Duration In Days>"
        }
      ]
    }
  }

  message.channel.send(message_embed);

}
