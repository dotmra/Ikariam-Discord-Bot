const Discord = require('discord.js');
const fs = require('fs');
const RssFeedEmitter = require('rss-feed-emitter');
const Enmap = require("enmap");

const client = new Discord.Client();

const config = require('./config.json');
const prefix = config.prefix;

let feeder = new RssFeedEmitter();
feeder.add({
  url: 'http://lorem-rss.herokuapp.com/feed', //https://board.us.ikariam.gameforge.com/index.php/BoardFeed/24/
});

client.settings = new Enmap({
  name: "settings",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: 'deep',
  dataDir: './data/enmap'
});

const defaultSettings = {
  prefix: "!",
  adminRole: "Admin",
  commandMode: "ALL",
  commandModeAllServer: "",
  channelServers: {
    // 507181827207987201: "Dionysos"
  },
  newsChannel: "" // Channel to post News from Ikariam Boards
}

client.on("guildDelete", guild => {
  client.settings.delete(guild.id);
});

client.on("guildCreate", guild => {

  console.log(`The bot is now a member of the server: ${guild.name} (${guild.id})`);

  guild.channels.sort(function(chan1,chan2){
    if(chan1.type!==`text`) return 1;
    if(!chan1.permissionsFor(guild.me).has(`SEND_MESSAGES`)) return -1;
    return chan1.position < chan2.position ? -1 : 1;
  }).first().send(
    `**Hello!** I'm a Discord bot for the browser game Ikariam. To view available commands do \`!commands\`\n`
    + `\nFirst, let's setup how I am going to work. There are two ways, a Global Server mode and a Channel mode. To issue the below commands you need to have a role named \`Admin\` assigned.\n`
    + `\nIf your server only wish to get information for only one Ikariam server, e.g. Alpha, I recommend the Global Server mode.`
    + `\nTo use the Global Server mode, do \`!globalserver <Ikariam Server Name>\` and you can issue commands in all text channels, easy peasy.\n`
    + `\nIf you wish to use different Ikariam servers on different channels, you can use the Channel mode.`
    + `\nTo use the Channel mode, first do \`!globalserver off\`, then \`!addserver <Ikariam Server Name>\` in the text channels you want to use for that Ikariam Server. You will have to issue this command in all the text channels you want commands to work, but this allows the bot to work with different Ikariam Servers on the same Discord Server.`
    + `\n\nGo ahead and try, if you have problems setting up the bot, run into issues or have any suggestions, please do not hesitate to contact my owner 7marre#7777 on Discord.`

  );
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ status: 'online', game: { name: 'commands', type: 'LISTENING' } })
    .catch(console.error);

  feeder.on('new-item', function(item) {
    //console.log(item);
    message_embed = {
      embed: {
        color: 3447003,
        author: {
          name: 'Game News!'
        },
        fields: [{
            name: item.title,
            value: item.description + "\n\n" + item.link
          }
        ],
        timestamp: Date.parse(item.meta.date),
        footer: {
          icon_url: 'https://i.imgur.com/ZH9wOAQ.png',
          text: 'board.us.ikariam.gameforge.com'
        }
      }
    }
    //client.channels.get("491615733785165825").send(message_embed);
  });

});

client.on('message', async (message) => {

  if(!message.guild || message.author.bot) return;

  const guildConf = client.settings.ensure(message.guild.id, defaultSettings);

  if(message.content.indexOf(guildConf.prefix) !== 0) return;

  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(guildConf.prefix.length).toLowerCase();

  try {
    let commandFile = require(`./commands/${command}.js`);

    if (command === "commands") {
      commandFile.run(message, args);
      console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
    }

    /*if (command === "setconf") {
      commandFile.run(guildConf, client, message, args);
    }*/

    /*if (command === "showconf") {
      commandFile.run(guildConf, client, message, args);
    }*/

    if (command === "addserver") {
      commandFile.run(guildConf, client, message, args);
      console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
    }

    if (command === "globalserver") {
      commandFile.run(guildConf, client, message, args);
      console.log(`${message.author.tag} issued command !${command} ${args.join(' ')} in server: ${message.guild.name} (${message.guild.id})`);
    }

    if (command === "find") {

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

    if (command === "info") {

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

    if (command === "growth") {

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

    if (command === "island") {

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

  } catch (err) {
    message.channel.send(`\`${guildConf.prefix}${command}\` is not a command. To view all commands do \`!commands\``);
    if(err.code == 'MODULE_NOT_FOUND') {
      return;
    }
    console.error(err);
  }

});

client.login(config.token);

client.on('error', console.error);
