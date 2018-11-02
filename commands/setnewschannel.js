exports.run = (guildConf, client, message, args) => {
  const adminRole = message.guild.roles.find(x => x.name === guildConf.adminRole); // .find("name", guildConf.adminRole);
  if(!adminRole) return message.channel.send(`A role with the name \`Admin\` not found.`).catch((err) => {
    if(err != "DiscordAPIError: Missing Permissions"){
      return console.error(err);
    }
    return console.log(`Command !addserver: No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
  });

  if(!message.member.roles.has(adminRole.id)) {
    return message.channel.send(`You need to have the \`Admin\` role to issue this command!`).catch((err) => {
      if(err != "DiscordAPIError: Missing Permissions"){
        return console.error(err);
      }
      return console.log(`Command !addserver: No permission to send message to channel #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions)`);
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
