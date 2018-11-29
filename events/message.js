const errorHandler = require('../custom_modules/error_handler.js');
const messageLogger = require('../custom_modules/message_logger.js');

module.exports = (client, message, defaultSettings) => {
  if(!message.guild || message.author.bot) return;

  const guildConf = client.settings.ensure(message.guild.id, defaultSettings);

  if(message.content.indexOf(guildConf.prefix) !== 0) return;

  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(guildConf.prefix.length).toLowerCase();

  try {
    let commandFile = require(`../commands/${command}.js`);

    if (command === "commands") {
      commandFile.run(client, message, args);
    }

    if (command === "region") {
      commandFile.run(client, message, args, guildConf);
    }

    if (command === "ikariamworld") {
      commandFile.run(client, message, args, guildConf);
    }

    if (command === "mode") {
      commandFile.run(client, message, args, guildConf);
    }

    if (command === "find") {
      commandFile.run(client, message, args, guildConf);
    }

    if (command === "info") {
      commandFile.run(client, message, args, guildConf);
    }

    if (command === "growth") {
      commandFile.run(client, message, args, guildConf);
    }

    if (command === "island") {
      commandFile.run(client, message, args, guildConf);
    }

    if (command === "test") {
      commandFile.run(client, message, args);
    }

  } catch (err) {
    if(err.code == 'MODULE_NOT_FOUND') { //if command file is not found, e.g. command file is deleted
      return;
    }
    return errorHandler.discordMessageError(message, err)
  }

}
