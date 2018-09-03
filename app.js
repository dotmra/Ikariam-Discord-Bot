const Discord = require('discord.js');
const fs = require("fs");
const config = require("./config.json");
const client = new Discord.Client();
const prefix = config.prefix;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  if (msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, msg, args);
  } catch (err) {
    console.error(err);
  }
  
});

client.login(config.token);
