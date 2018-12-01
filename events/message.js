const errorHandler = require('../custom_modules/error_handler.js');
const messageLogger = require('../custom_modules/message_logger.js');
const Bottleneck = require("bottleneck");
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 5000
});


module.exports = (client, message, defaultSettings) => {
  if(!message.guild || message.author.bot) return;

  messageLogger.log(client, message);

  const guildConf = client.settings.ensure(message.guild.id, defaultSettings);

  if(message.content.indexOf(guildConf.prefix) !== 0) return;

  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(guildConf.prefix.length).toLowerCase();

  try {
    let commandFile = require(`../commands/${command}.js`);

    console.log(`COMMAND: ${new Date().toLocaleTimeString()}: ${message.guild.name}, #${message.channel.name}, ${message.author.tag}: ${message.content}`);

    if (command === "commands") {
      commandFile.run(client, message, args);
    }

    if (command === "region") {
      limiter.schedule(() => {
        commandFile.run(client, message, args, guildConf);
      });
    }

    if (command === "ikariamworld") {
      limiter.schedule(() => {
        commandFile.run(client, message, args, guildConf);
      });
    }

    if (command === "mode") {
      commandFile.run(client, message, args, guildConf);
    }

    if (command === "find") {
      limiter.schedule(() => {
        commandFile.run(client, message, args, guildConf);
      });
    }

    if (command === "info") {
      limiter.schedule(() => {
        commandFile.run(client, message, args, guildConf);
      });
    }

    if (command === "growth") {
      limiter.schedule(() => {
        commandFile.run(client, message, args, guildConf);
      });
    }

    if (command === "island") {
      limiter.schedule(() => {
        commandFile.run(client, message, args, guildConf);
      });
    }

    if (command === "test") {
      limiter.schedule(() => {
        commandFile.run(client, message, args, guildConf);
      });
    }

  } catch (err) {
    if(err.code == 'MODULE_NOT_FOUND') { //if command file is not found, e.g. command file is deleted
      return;
    }
    return errorHandler.discordMessageError(message, err)
  }

}
