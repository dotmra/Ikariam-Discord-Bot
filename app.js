const Discord = require('discord.js');
const fs = require("fs");
const config = require("./config.json");
const bot = new Discord.Client();
const prefix = config.prefix;

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  bot.user.setPresence({ status: "online", game: { name: "commands", type: "LISTENING" } })
    .catch(console.error);
});

bot.on('message', msg => {

  if (msg.author.bot) return;
  if (msg.channel.type === 'dm') return;

  if(msg.content.startsWith(config.prefix)){
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
      let commandFile = require(`./commands/${command}.js`);
      commandFile.run(bot, msg, args);
    } catch (err) {
      if(err.code == 'MODULE_NOT_FOUND'){
        return;
      }
      console.error(err);
    }
  }
  else{
    return;
  }

});

bot.login(config.token);
