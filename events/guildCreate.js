module.exports = (client, guild) => {
  console.log(`The bot is now a member of the server: ${guild.name} (${guild.id})`);

  guild.channels.sort(function(chan1,chan2){
    if(chan1.type!==`text`) return 1;
    if(!chan1.permissionsFor(guild.me).has(`SEND_MESSAGES`)) return -1;
    return chan1.position < chan2.position ? -1 : 1;
  }).first().send(
    `**Hello!** I'm a Discord bot for the browser game Ikariam. To view available commands do \`!commands\`\n`
    + `\nFirst, let's setup how I am going to work. There are two ways, a Global Server mode and a Channel mode. To issue the below commands you need to have a role named \`Admin\` assigned.\n`
    + `\nIf your server only wish to get information for only one Ikariam server, e.g. Alpha, I recommend the Global Server mode.`
    + `\nTo use the Global Server mode, do \`!globalserver <Ikariam Server Name>\` and you can issue commands in all text channels, easy peasy.\n`
    + `\nIf you wish to use different Ikariam servers on different channels, you can use the Channel mode.`
    + `\nTo use the Channel mode, first do \`!globalserver off\`, then \`!addserver <Ikariam Server Name>\` in the text channels you want to use for that Ikariam Server. You will have to issue this command in all the text channels you want commands to work, but this allows the bot to work with different Ikariam Servers on the same Discord Server.`
    + `\n\nGo ahead and try, if you have problems setting up the bot, run into issues or have any suggestions, please do not hesitate to contact my owner 7marre#7777 on Discord.`
  )
  .catch(function(err) {
    console.log(`Unable to send message to in the Discord server (no permission), server: ${guild.name} (${guild.id})`);

    guild.owner.send(`I was unable to post this message on the server due to missing permissions. This was meant to be posted on the Discord server in a text channel but you are receiving this here instead. Please correct my permissions before proceeding to set me up. For assistance contact my owner 7marre#7777 on Discord.\n\n`
      + `\n**Hello!** I'm a Discord bot for the browser game Ikariam. To view available commands do \`!commands\`\n`
      + `\nFirst, let's setup how I am going to work. There are two ways, a Global Server mode and a Channel mode. To issue the below commands you need to have a role named \`Admin\` assigned.\n`
      + `\nIf your server only wish to get information for only one Ikariam server, e.g. Alpha, I recommend the Global Server mode.`
      + `\nTo use the Global Server mode, do \`!globalserver <Ikariam Server Name>\` and you can issue commands in all text channels, easy peasy.\n`
      + `\nIf you wish to use different Ikariam servers on different channels, you can use the Channel mode.`
      + `\nTo use the Channel mode, first do \`!globalserver off\`, then \`!addserver <Ikariam Server Name>\` in the text channels you want to use for that Ikariam Server. You will have to issue this command in all the text channels you want commands to work, but this allows the bot to work with different Ikariam Servers on the same Discord Server.`
      + `\n\nGo ahead and try, if you have problems setting up the bot, run into issues or have any suggestions, please do not hesitate to contact my owner 7marre#7777 on Discord.`
    )
    .catch(function(err) {
      if(err != "DiscordAPIError: Cannot send messages to this user"){
        console.log(err);
      }
      else {
        console.log(`Unable to send DM to #${guild.owner.tag} (server owner) or in the Discord server upon joining.`);
      }
    });
  });
}
