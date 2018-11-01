module.exports = (client, message, defaultSettings) => {
  if(!message.guild || message.author.bot) return;

  const guildConf = client.settings.ensure(message.guild.id, defaultSettings);

  if(message.content.indexOf(guildConf.prefix) !== 0) return;

  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(guildConf.prefix.length).toLowerCase();

  try {
    let commandFile = require(`../commands/${command}.js`);

    if (command === "commands") {
      if (message.guild.me.hasPermission('ADMINISTRATOR')) {
        commandFile.run(message, args);
        console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
      }
      else {
        message.author.send(`Hey, I do not have permission to talk in \`#${message.channel.name}\``
          + ` so I cannot reply to your command \`!${command}\`. If you believe I should have permission to talk in \`#${message.channel.name}\`,`
          + ` tell the Discord server admin and have them check my permissions.`)
        .catch(function(err) {
          if(err != "DiscordAPIError: Cannot send messages to this user"){
            console.log(err);
          }
          else {
            console.log(`Unable to send DM to #${message.author.tag}.`);
          }
        });
      }
    }

    /*if (command === "setconf") {
      commandFile.run(guildConf, client, message, args);
    }*/

    /*if (command === "showconf") {
      commandFile.run(guildConf, client, message, args);
    }*/

    if (command === "addserver") {
      if (message.guild.me.hasPermission('ADMINISTRATOR')) {
        commandFile.run(guildConf, client, message, args);
        console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
      }
      else {
        message.author.send(`Hey, I do not have permission to talk in \`#${message.channel.name}\``
          + ` so I cannot reply to your command \`!${command}\`. If you believe I should have permission to talk in \`#${message.channel.name}\`,`
          + ` tell the Discord server admin and have them check my permissions.`)
        .catch(function(err) {
          if(err != "DiscordAPIError: Cannot send messages to this user"){
            console.log(err);
          }
          else {
            console.log(`Unable to send DM to #${message.author.tag}.`);
          }
        });
      }
    }

    if (command === "globalserver") {
      if (message.guild.me.hasPermission('ADMINISTRATOR')) {
        commandFile.run(guildConf, client, message, args);
        console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
      }
      else {
        message.author.send(`Hey, I do not have permission to talk in \`#${message.channel.name}\``
          + ` so I cannot reply to your command \`!${command}\`. If you believe I should have permission to talk in \`#${message.channel.name}\`,`
          + ` tell the Discord server admin and have them check my permissions.`)
        .catch(function(err) {
          if(err != "DiscordAPIError: Cannot send messages to this user"){
            console.log(err);
          }
          else {
            console.log(`Unable to send DM to #${message.author.tag}.`);
          }
        });
      }
    }

    if (command === "find") {
      if (message.guild.me.hasPermission('ADMINISTRATOR')) {
        if (client.settings.get(message.guild.id, "commandMode") === "ALL") {
          if (guildConf.commandModeAllServer.length == 0) {
            message.channel.send("This server does not have an Ikariam server assigned. Use \`!globalserver (Ikariam Server Name)\` to assign an Ikariam server for the bot to use or \`!globalserver off\` to turn off global server.");
          }
          else {
            let ikaServer = client.settings.get(message.guild.id, "commandModeAllServer");
            commandFile.run(ikaServer, client, message, args);
            console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
          }
        }
        else {
          if (!guildConf.channelServers.hasOwnProperty(message.channel.id)) {
            message.channel.send("This channel does not have an Ikariam server assigned. Use \`!addserver (Ikariam Server Name)\` to assign an Ikariam server for the bot to use in this channel.");
          }
          else {
            let ikaServer = guildConf.channelServers[message.channel.id];
            commandFile.run(ikaServer, client, message, args);
            console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
          }
        }
      }
      else {
        message.author.send(`Hey, I do not have permission to talk in \`#${message.channel.name}\``
          + ` so I cannot reply to your command \`!${command}\`. If you believe I should have permission to talk in \`#${message.channel.name}\`,`
          + ` tell the Discord server admin and have them check my permissions.`)
        .catch(function(err) {
          if(err != "DiscordAPIError: Cannot send messages to this user"){
            console.log(err);
          }
          else {
            console.log(`Unable to send DM to #${message.author.tag}.`);
          }
        });
      }
    }

    if (command === "info") {
      if (message.guild.me.hasPermission('ADMINISTRATOR')) {
        if (client.settings.get(message.guild.id, "commandMode") === "ALL") {
          let ikaServer = client.settings.get(message.guild.id, "commandModeAllServer");
          commandFile.run(ikaServer, client, message, args);
          console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
        }
        else {
          if (!guildConf.channelServers.hasOwnProperty(message.channel.id)) {
            console.log(guildConf);
            message.channel.send("This channel does not have an Ikariam server assigned. Use \`!addserver (Ikariam Server Name)\` to assign an Ikariam server for the bot to use in this channel.");
          }
          else {
            let ikaServer = guildConf.channelServers[message.channel.id];
            commandFile.run(ikaServer, client, message, args);
            console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
          }
        }
      }
      else {
        message.author.send(`Hey, I do not have permission to talk in \`#${message.channel.name}\``
          + ` so I cannot reply to your command \`!${command}\`. If you believe I should have permission to talk in \`#${message.channel.name}\`,`
          + ` tell the Discord server admin and have them check my permissions.`)
        .catch(function(err) {
          if(err != "DiscordAPIError: Cannot send messages to this user"){
            console.log(err);
          }
          else {
            console.log(`Unable to send DM to #${message.author.tag}.`);
          }
        });
      }
    }

    if (command === "growth") {
      if (message.guild.me.hasPermission('ADMINISTRATOR')) {
        if (client.settings.get(message.guild.id, "commandMode") === "ALL") {
          let ikaServer = client.settings.get(message.guild.id, "commandModeAllServer");
          commandFile.run(ikaServer, client, message, args);
          console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
        }
        else {
          if (!guildConf.channelServers.hasOwnProperty(message.channel.id)) {
            console.log(guildConf);
            message.channel.send("This channel does not have an Ikariam server assigned. Use \`!addserver (Ikariam Server Name)\` to assign an Ikariam server for the bot to use in this channel.");
          }
          else {
            let ikaServer = guildConf.channelServers[message.channel.id];
            commandFile.run(ikaServer, client, message, args);
            console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
          }
        }
      }
      else {
        message.author.send(`Hey, I do not have permission to talk in \`#${message.channel.name}\``
          + ` so I cannot reply to your command \`!${command}\`. If you believe I should have permission to talk in \`#${message.channel.name}\`,`
          + ` tell the Discord server admin and have them check my permissions.`)
        .catch(function(err) {
          if(err != "DiscordAPIError: Cannot send messages to this user"){
            console.log(err);
          }
          else {
            console.log(`Unable to send DM to #${message.author.tag}.`);
          }
        });
      }
    }

    if (command === "island") {
      if (message.guild.me.hasPermission('ADMINISTRATOR')) {
        if (client.settings.get(message.guild.id, "commandMode") === "ALL") {
          let ikaServer = client.settings.get(message.guild.id, "commandModeAllServer");
          commandFile.run(ikaServer, client, message, args);
          console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
        }
        else {
          if (!guildConf.channelServers.hasOwnProperty(message.channel.id)) {
            console.log(guildConf);
            message.channel.send("This channel does not have an Ikariam server assigned. Use \`!addserver (Ikariam Server Name)\` to assign an Ikariam server for the bot to use in this channel.");
          }
          else {
            let ikaServer = guildConf.channelServers[message.channel.id];
            commandFile.run(ikaServer, client, message, args);
            console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
          }
        }
      }
      else {
        message.author.send(`Hey, I do not have permission to talk in \`#${message.channel.name}\``
          + ` so I cannot reply to your command \`!${command}\`. If you believe I should have permission to talk in \`#${message.channel.name}\`,`
          + ` tell the Discord server admin and have them check my permissions.`)
        .catch(function(err) {
          if(err != "DiscordAPIError: Cannot send messages to this user"){
            console.log(err);
          }
          else {
            console.log(`Unable to send DM to #${message.author.tag}.`);
          }
        });
      }
    }

  } catch (err) {
    if (message.guild.me.hasPermission('ADMINISTRATOR')) {
      message.channel.send(`\`${guildConf.prefix}${command}\` is not a command. To view all commands do \`!commands\``);
    }
    else {
      message.author.send(`Hey, I do not have permission to talk in \`#${message.channel.name}\``
        + ` so I cannot reply to your command \`!${command}\`. If you believe I should have permission to talk in \`#${message.channel.name}\`,`
        + ` tell the Discord server admin and have them check my permissions.`)
      .catch(function(err) {
        if(err != "DiscordAPIError: Cannot send messages to this user"){
          console.log(err);
        }
        else {
          console.log(`Unable to send DM to #${message.author.tag}.`);
        }
      });
    }
    if(err.code == 'MODULE_NOT_FOUND') {
      return;
    }
    console.error(err);
  }

}
