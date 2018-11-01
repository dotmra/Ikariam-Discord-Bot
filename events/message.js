module.exports = (client, message, defaultSettings) => {
  if(!message.guild || message.author.bot) return;

  const guildConf = client.settings.ensure(message.guild.id, defaultSettings);

  if(message.content.indexOf(guildConf.prefix) !== 0) return;

  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(guildConf.prefix.length).toLowerCase();

  try {
    let commandFile = require(`../commands/${command}.js`);

    /*if (command === "setconf") {
      commandFile.run(guildConf, client, message, args);
    }*/

    /*if (command === "showconf") {
      commandFile.run(guildConf, client, message, args);
    }*/

    if (command === "commands") {
      commandFile.run(client, message, args);
      console.log(`${message.author.tag} issued command '${command} ${args.join(' ')}' in server: '${message.guild.name}' (${message.guild.id}) in channel '#${message.channel.name}'`);
    }

    if (command === "addserver") {
      commandFile.run(guildConf, client, message, args);
      console.log(`${message.author.tag} issued command '${command} ${args.join(' ')}' in server: '${message.guild.name}' (${message.guild.id}) in channel '#${message.channel.name}'`);
    }

    if (command === "globalserver") {
      commandFile.run(guildConf, client, message, args);
      console.log(`${message.author.tag} issued command '${command} ${args.join(' ')}' in server: '${message.guild.name}' (${message.guild.id}) in channel '#${message.channel.name}'`);
    }

    if (command === "find") {
      commandFile.run(client, message, args);
      console.log(`${message.author.tag} issued command '${command} ${args.join(' ')}' in server: '${message.guild.name}' (${message.guild.id}) in channel '#${message.channel.name}'`);
    }

    if (command === "info") {
      commandFile.run(client, message, args);
      console.log(`${message.author.tag} issued command '${command} ${args.join(' ')}' in server: '${message.guild.name}' (${message.guild.id}) in channel '#${message.channel.name}'`);
    }

    if (command === "growth") {
      commandFile.run(client, message, args);
      console.log(`${message.author.tag} issued command '${command} ${args.join(' ')}' in server: '${message.guild.name}' (${message.guild.id}) in channel '#${message.channel.name}'`);
    }

    if (command === "island") {
      commandFile.run(client, message, args);
      console.log(`${message.author.tag} issued command '${command} ${args.join(' ')}' in server: '${message.guild.name}' (${message.guild.id}) in channel '#${message.channel.name}'`);
    }

  } catch (err) {
    if(err.code == 'MODULE_NOT_FOUND') { //if command file is not found, e.g. not a command
      return message.channel.send(`\`${guildConf.prefix}${command}\` is not a command. To view all commands do \`!commands\``).catch((err) => {
        if(err != "DiscordAPIError: Missing Permissions"){
          return console.error(err);
        }
        return console.log(`Command '${command} ${args.join(' ')}': No permission to send message to channel '#${message.channel.name}' in guild '${message.guild.name}' (${message.guild.id}) (DiscordAPIError: Missing Permissions)`);
      });
    }
    if(err != "DiscordAPIError: Missing Permissions"){
      return console.error(err);
    }
    return console.log(`Command '${command} ${args.join(' ')}': No permission to send message to channel '#${message.channel.name}' in guild '${message.guild.name}' (${message.guild.id}) (DiscordAPIError: Missing Permissions)`);
  }

}
