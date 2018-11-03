module.exports = (client, guild) => {
  console.log(`The bot has joined a server, ID: ${guild.id}, NAME: ${guild.name}, MEMBERS: ${guild.memberCount})`);

  let filteredChannels = guild.channels.filter(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));

  if (filteredChannels) {
    let sortedChannels = filteredChannels.sort((chan1, chan2) => {return chan1.position < chan2.position ? -1 : 1});
    sortedChannels.first().send(`Hello, I'm a bot. Thanks for inviting me, commands: \`!commands\`\nFor help on setting me up: <https://github.com/7marre/Ikariam-Discord-Bot/wiki/Adding-the-bot-to-your-server>`).catch((err) => {
      if(err != "DiscordAPIError: Missing Permissions" && err != "DiscordAPIError: Cannot send messages to this user"){
        return console.error(err);
      }
      return console.log(`No permission (SEND_MESSAGES) to send guildCreate message in channel #${sortedChannels.first().name} in guild '${guild.name}'. (DiscordAPIError: Missing Permissions)`);
    });
    return console.log(`Successfully sent guildCreate message in guild '${guild.name}' in channel '#${sortedChannels.first().name}'`);
  }

  else {
    return console.log(`Failed to send guildCreate message in guild '${guild.name}' (${guild.id}) (Missing SEND_MESSAGES permission in all channels)`);
    guild.owner.send(`Hey, I did not have permission (SEND_MESSAGES) to send a message in any channel to the server ${guild.name} upon joining. Please fix this.\nFor help on setting me up correctly: <https://github.com/7marre/Ikariam-Discord-Bot/wiki/Adding-the-bot-to-your-server>`).catch((err) => {
      if(err != "DiscordAPIError: Missing Permissions" && err != "DiscordAPIError: Cannot send messages to this user"){
        return console.error(err);
      }
      return console.log(`No permission to send DM to owner #${guild.owner.tag} in guild '${guild.name}' (DiscordAPIError: Cannot send messages to this user)`);
    });
  }

}
