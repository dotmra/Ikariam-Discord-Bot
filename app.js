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
    }

    /*if (command === "setconf") {
      commandFile.run(guildConf, client, message, args);
    }*/

    /*if (command === "showconf") {
      commandFile.run(guildConf, client, message, args);
    }*/

    if (command === "addserver") {
      commandFile.run(guildConf, client, message, args);
    }

    if (command === "globalserver") {
      commandFile.run(guildConf, client, message, args);
    }

    if (command === "find") {

      if (client.settings.get(message.guild.id, "commandMode") === "ALL") {
        let ikaServer = client.settings.get(message.guild.id, "commandModeAllServer");
        commandFile.run(ikaServer, client, message, args);
      }
      else {
        if (!guildConf.channelServers.hasOwnProperty(message.channel.id)) {
          console.log(guildConf);
          message.channel.send("This channel does not have an Ikariam server assigned. Use \`!addserver (Ikariam Server Name)\` to assign an Ikariam server for the bot to use in this channel.");
        }
        else {
          let ikaServer = guildConf.channelServers[message.channel.id];
          commandFile.run(ikaServer, client, message, args);
        }
      }

    }

    if (command === "info") {

      if (client.settings.get(message.guild.id, "commandMode") === "ALL") {
        let ikaServer = client.settings.get(message.guild.id, "commandModeAllServer");
        commandFile.run(ikaServer, client, message, args);
      }
      else {
        if (!guildConf.channelServers.hasOwnProperty(message.channel.id)) {
          console.log(guildConf);
          message.channel.send("This channel does not have an Ikariam server assigned. Use \`!addserver (Ikariam Server Name)\` to assign an Ikariam server for the bot to use in this channel.");
        }
        else {
          let ikaServer = guildConf.channelServers[message.channel.id];
          commandFile.run(ikaServer, client, message, args);
        }
      }

    }

    if (command === "growth") {

      if (client.settings.get(message.guild.id, "commandMode") === "ALL") {
        let ikaServer = client.settings.get(message.guild.id, "commandModeAllServer");
        commandFile.run(ikaServer, client, message, args);
      }
      else {
        if (!guildConf.channelServers.hasOwnProperty(message.channel.id)) {
          console.log(guildConf);
          message.channel.send("This channel does not have an Ikariam server assigned. Use \`!addserver (Ikariam Server Name)\` to assign an Ikariam server for the bot to use in this channel.");
        }
        else {
          let ikaServer = guildConf.channelServers[message.channel.id];
          commandFile.run(ikaServer, client, message, args);
        }
      }

    }

    if (command === "island") {

      if (client.settings.get(message.guild.id, "commandMode") === "ALL") {
        let ikaServer = client.settings.get(message.guild.id, "commandModeAllServer");
        commandFile.run(ikaServer, client, message, args);
      }
      else {
        if (!guildConf.channelServers.hasOwnProperty(message.channel.id)) {
          console.log(guildConf);
          message.channel.send("This channel does not have an Ikariam server assigned. Use \`!addserver (Ikariam Server Name)\` to assign an Ikariam server for the bot to use in this channel.");
        }
        else {
          let ikaServer = guildConf.channelServers[message.channel.id];
          commandFile.run(ikaServer, client, message, args);
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
