const Discord = require('discord.js');
const fs = require('fs');
const RssFeedEmitter = require('rss-feed-emitter');
const config = require('./config.json');
const bot = new Discord.Client();
const prefix = config.prefix;

let feeder = new RssFeedEmitter();
feeder.add({
  url: 'http://lorem-rss.herokuapp.com/feed', //https://board.us.ikariam.gameforge.com/index.php/BoardFeed/24/
});

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  bot.user.setPresence({ status: 'online', game: { name: 'commands', type: 'LISTENING' } })
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
    //bot.channels.get("491615733785165825").send(message_embed);
  });

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
        commandFile.run("Warserver 03", bot, msg, args);
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
