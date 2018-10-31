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
  modLogChannel: "mod-log",
  modRole: "Mod",
  adminRole: "Admin",
  welcomeChannel: "welcome",
  welcomeMessage: "Say hello to {{user}}, everyone!"
}

client.on("guildDelete", guild => {
  // When the bot leaves or is kicked, delete settings to prevent stale entries.
  client.settings.delete(guild.id);
});

client.on("guildMemberAdd", member => {
  // This executes when a member joins, so let's welcome them!

  // First, ensure the settings exist
  client.settings.ensure(member.guild.id, defaultSettings);

  // Then, get the welcome message using get:
  let welcomeMessage = client.settings.get(member.guild.id, "welcomeMessage");

  // Our welcome message has a bit of a placeholder, let's fix that:
  welcomeMessage = welcomeMessage.replace("{{user}}", member.user.tag)

  // we'll send to the welcome channel.
  member.guild.channels
    .find("name", client.settings.get(member.guild.id, "welcomeChannel"))
    .send(welcomeMessage)
    .catch(console.error);
});

let feeder = new RssFeedEmitter();
feeder.add({
  url: 'http://lorem-rss.herokuapp.com/feed', //https://board.us.ikariam.gameforge.com/index.php/BoardFeed/24/
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

client.on('message', message => {

  // This stops if the message is not sent in a guild(Discord Server), and we ignore all bots.
  if(!message.guild || message.author.bot) return;

  // We can use ensure() to actually grab the default value for settings,
  // IF the key doesn't already exist.
  const guildConf = client.settings.ensure(message.guild.id, defaultSettings);

  // Now we can use the values!
  // We stop processing if the message does not start with our prefix for this guild.
  if(message.content.indexOf(guildConf.prefix) !== 0) return;

  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(guildConf.prefix.length).toLowerCase();

  try {
    let commandFile = require(`./commands/${command}.js`);

    if (command === "setconf") {
      commandFile.run(guildConf, client, message, args);
    }

    if (command === "showconf") {
      commandFile.run(guildConf, client, message, args);
    }

  } catch (err) {
    if(err.code == 'MODULE_NOT_FOUND') {
      return;
    }
    console.error(err);
  }

});

client.login(config.token);

client.on('error', console.error);
