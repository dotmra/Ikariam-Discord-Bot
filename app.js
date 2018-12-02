const Discord = require('discord.js');
const Enmap = require('enmap');
const schedule = require('node-schedule');
const client = new Discord.Client();

client.config = require('./config.json');

client.clientData = new Enmap({
  name: 'clientData',
  fetchAll: false,
  autoFetch: true,
  cloneLevel: 'deep',
  dataDir: './data/clientData'
});

client.settings = new Enmap({
  name: 'settings',
  fetchAll: false,
  autoFetch: true,
  cloneLevel: 'deep',
  dataDir: './data/enmap'
});

const defaultSettings = {
  prefix: '!',
  botMode: 'server',
  botRegion: 'us',
  serverModeWorld: '',
  channelModeWorlds: {
  },
  newsChannel: ''
};

schedule.scheduleJob('*/10 * * * *', () => {
  require('./events/checkGameNews.js')(client, defaultSettings);
});

client.on('ready', () => require('./events/ready.js')(client));
client.on('error', (error) => require('./events/error.js')(client, error));
client.on('guildDelete', (guild) => require('./events/guildDelete.js')(client, guild));
client.on('guildCreate', (guild) => require('./events/guildCreate.js')(client, guild));
client.on('message', (message) => require('./events/message.js')(client, message, defaultSettings));

client.login(client.config.token);
