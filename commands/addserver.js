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

  if (client.settings.get(message.guild.id, "commandMode") === "ALL") {
    message.channel.send("You have not enabled channel specific servers, to do so, type: \`!globalserver off\`");
  }
  else {

    if (args.toLowerCase() === "warserver 03") {
      guildConf.channelServers[message.channel.id] = "Warserver 03"

      client.settings.set(message.guild.id, guildConf.channelServers, "channelServers");
      message.channel.send(`The channel \`#${message.channel.name}\` now uses the \`Warserver 03\` Ikariam server for commands.`);
    }

    else {
      if (!servers.hasOwnProperty(args.toLowerCase())) {
        message.channel.send(`The Ikariam server \`${args}\` does not exist. Here is a list of valid servers:\nAlpha, Beta, Ny, Omega, Apollon, Asklepios, Boreas, Charon, Demeter, Dionysos, Eirene`);
      }
      else {
        guildConf.channelServers[message.channel.id] = servers[args];

        client.settings.set(message.guild.id, guildConf.channelServers, "channelServers");
        message.channel.send(`The channel \`#${message.channel.name}\` now uses the \`${servers[args]}\` Ikariam server for commands.`);
      }
    }

  }

}
