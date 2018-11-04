exports.run = (client, message, args) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send(`You need to be an \`Administrator\` in this Discord server to issue this command!`).catch((err) => {
      if(err != "DiscordAPIError: Missing Permissions"){
        return console.error(err);
      }
      return console.log(`Command !globalserver: No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
    });
  }

  client.settings.set(message.guild.id, message.channel.id, 'newsChannel');
  message.channel.send(`The channel \`#${message.channel.name}\` will now be used for posting Game News from Boards.`).catch((err) => {
    if(err != "DiscordAPIError: Missing Permissions"){
      return console.error(err);
    }
    return console.log(`Command !setnewschannel: No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
  });

}
