exports.run = (guildConf, client, message, args) => {
  const adminRole = message.guild.roles.find(x => x.name === guildConf.adminRole); // .find("name", guildConf.adminRole);
  if(!adminRole) return message.channel.send(`A role with the name \`Admin\` not found.`);

  if(!message.member.roles.has(adminRole.id)) {
    return message.channel.send(`You need to have the \`Admin\` role to issue this command!`);
  }

  args = args.join(' ');

  servers = {
    'alpha': 'Alpha',
    'beta': 'Beta',
    'ny': 'Ny',
    'omega': 'Omega',
    'apollon': 'Apollon',
    'asklepios': 'Asklepios',
    'boreas': 'Boreas',
    'charon': 'Charon',
    'demeter': 'Demeter',
    'dionysos': 'Dionysos',
    'eirene': 'Eirene',
    'warserver 03': 'Warserver 03'
  }

  if (args.toLowerCase() === "off") {
    client.settings.set(message.guild.id, "CHANNEL", "commandMode");
    client.settings.set(message.guild.id, "", "commandModeAllServer");
    message.channel.send(`The server is now in \`CHANNEL\` mode. Use \`!addserver <Ikariam Server Name>\` in a channel to enable commands for that channel.`);
  }
  else {
    if (!servers.hasOwnProperty(args.toLowerCase())) {
      message.channel.send(`The Ikariam server \`${args}\` does not exist. Here is a list of valid servers:\nAlpha, Beta, Ny, Omega, Apollon, Asklepios, Boreas, Charon, Demeter, Dionysos, Eirene, Warserver 03`);
    }
    else {
      client.settings.set(message.guild.id, "ALL", "commandMode");
      client.settings.set(message.guild.id, servers[args], "commandModeAllServer");
      client.settings.set(message.guild.id, {}, "channelServers");
      message.channel.send(`The ikariam server \`${servers[args]}\` will now be used for commands in all channels.`);
    }
  }
}
