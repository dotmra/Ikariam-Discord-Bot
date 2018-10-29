const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const bot = new Discord.Client();
const prefix = config.prefix;

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  bot.user.setPresence({ status: 'online', game: { name: 'commands', type: 'LISTENING' } })
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
      if (msg.channel.parentID == "497449133490307072") {
        commandFile.run("Eirene", bot, msg, args);
      }
      else if (msg.channel.parentID == "490241148875440148") {
        commandFile.run("Eirene", bot, msg, args);
      }
      else if (msg.channel.parentID == "471433407788744714") {
        commandFile.run("Dionysos", bot, msg, args);
      }
      else if (msg.channel.parentID == "501197652013350914") {
        commandFile.run("Dionysos", bot, msg, args);
      }
      else if (msg.channel.parentID == "471433980282011661") {
        commandFile.run("Dionysos", bot, msg, args);
      }
      else if (msg.channel.parentID == "471434430276173835") {
        commandFile.run("Dionysos", bot, msg, args);
      }
      else if (msg.channel.parentID == "471435348719828992") {
        commandFile.run("Dionysos", bot, msg, args);
      }
      else if (msg.channel.parentID == "471435804950921217") {
        commandFile.run("Dionysos", bot, msg, args);
      }
      else if (msg.channel.parentID == "475236737916862465") {
        commandFile.run("Dionysos", bot, msg, args);
      }
      else if (msg.channel.id == "445584026812809216") {
        commandFile.run("Alpha", bot, msg, args);
      }
      else if (msg.channel.id == "445584039227949066") {
        commandFile.run("Beta", bot, msg, args);
      }
      else if (msg.channel.id == "445584055250190356") {
        commandFile.run("Ny", bot, msg, args);
      }
      else if (msg.channel.id == "445584090578812930") {
        commandFile.run("Omega", bot, msg, args);
      }
      else if (msg.channel.id == "445584103765704715") {
        commandFile.run("Apollon", bot, msg, args);
      }
      else if (msg.channel.id == "445584118617735169") {
        commandFile.run("Asklepios", bot, msg, args);
      }
      else if (msg.channel.id == "445584171860099072") {
        commandFile.run("Boreas", bot, msg, args);
      }
      else if (msg.channel.id == "445584195604185119") {
        commandFile.run("Charon", bot, msg, args);
      }
      else if (msg.channel.id == "445584211760644106") {
        commandFile.run("Demeter", bot, msg, args);
      }
      else if (msg.channel.id == "445584303724953610") {
        commandFile.run("Dionysos", bot, msg, args);
      }
      else if (msg.channel.id == "488446025980313611") {
        commandFile.run("Eirene", bot, msg, args);
      }
      else if (msg.channel.id == "449248065887404032") {
        commandFile.run("Warserver+03", bot, msg, args);
      }
      // The 2 below channels are in test server
      else if (msg.channel.id == "506392322448162817") {
        commandFile.run("Dionysos", bot, msg, args);
      }
      else if (msg.channel.id == "506392376961662987") {
        commandFile.run("Eirene", bot, msg, args);
      }
      else {
        return;
      }
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

bot.on('error', console.error);
