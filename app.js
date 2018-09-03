const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const prefix = config.prefix;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(config.token);
