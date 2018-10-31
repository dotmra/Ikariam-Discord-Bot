exports.run = (guildConf, client, message, args) => {
  const adminRole = message.guild.roles.find(x => x.name === guildConf.adminRole); // .find("name", guildConf.adminRole);
  if(!adminRole) return message.reply("Administrator Role Not Found");

  if(!message.member.roles.has(adminRole.id)) {
    return message.reply("You're not an admin, sorry!");
  }

  args = args.join(' ');

  servers = {
    alpha: "Alpha",
    beta: "Beta",
    ny: "Ny",
    omega:"Omega",
    apollon: "Apollon",
    asklepios: "Asklepios",
    boreas: "Boreas",
    charon: "Charon",
    demeter: "Demeter",
    dionysos: "Dionysos",
    eirene: "Eirene"
  }

  if (args.toLowerCase() === "off") {
    client.settings.set(message.guild.id, "CHANNEL", "commandMode");
    client.settings.set(message.guild.id, "", "commandModeAllServer");
    message.channel.send(`The server is now in \`CHANNEL\` mode. Use \`!addserver (Ikariam Server Name)\` in a channel to enable commands for that server.`);
  }
  else {
    if (!servers.hasOwnProperty(args.toLowerCase())) {
      message.channel.send(`The Ikariam server \`${args}\` does not exist. Here is a list of valid servers:\nAlpha, Beta, Ny, Omega, Apollon, Asklepios, Boreas, Charon, Demeter, Dionysos, Eirene`);
    }
    else {
      client.settings.set(message.guild.id, "ALL", "commandMode");
      client.settings.set(message.guild.id, servers[args], "commandModeAllServer");
      client.settings.set(message.guild.id, {}, "channelServers");
      message.channel.send(`The ikariam server \`${servers[args]}\` will now be used for commands in all channels.`);
    }
  }
}
