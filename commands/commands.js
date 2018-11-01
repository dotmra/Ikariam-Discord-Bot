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

  message.channel.send(message_embed).catch((err) => {
    if(err != "DiscordAPIError: Missing Permissions"){
      return console.error(err);
    }
    return console.log(`No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
  });

}
