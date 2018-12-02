module.exports = {

  discordMessageError: function(message, err) {
    if(err != 'DiscordAPIError: Missing Permissions'){
      return console.error(err);
    }
    return console.log(`Missing permissions in #${message.channel.name} in guild '${message.guild.name}' (DiscordAPIError: Missing Permissions). Message:\n${message.content}`);
  },

  jsonParseError: function(err) {
    if(!err.message.startsWith('Unexpected token')){
      return console.error(err);
    }
    return console.log(`Error parsing JSON. Unexpected JSON (SyntaxError: Unexpected token). Error Message:\n${err}`);
  },

  otherError: function(err) {
    return console.error(err);
  },

  handledError: function(err) {
    return console.log(err);
  },

  customError: function(customErrorMessage) {
    return console.log(customErrorMessage);
  }

};
