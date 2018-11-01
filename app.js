const Discord = require('discord.js');
const fs = require('fs');
const RssFeedEmitter = require('rss-feed-emitter');
const Enmap = require("enmap");
const client = new Discord.Client();
const config = require('./config.json');
const prefix = config.prefix;

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
  },
  newsChannel: ""
}

client.on('ready', () => require('./events/ready.js')(client));
client.on('error', (error) => require('./events/error.js')(client, error));
client.on('guildDelete', (guild) => require('./events/guildDelete.js')(client, guild));
client.on('guildCreate', (guild) => require('./events/guildCreate.js')(client, guild));
client.on('message', (message) => require('./events/message.js')(client, message, defaultSettings));

client.login(config.token);
