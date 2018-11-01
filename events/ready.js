module.exports = (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ status: 'online', game: { name: 'commands', type: 'LISTENING' } })
    .catch(console.error);

  console.log(`Connected to ${client.guilds.size} Discord servers:`);
  client.guilds.forEach(guild => {
    console.log(`ID: ${guild.id}, NAME: ${guild.name}, MEMBERS: ${guild.memberCount}`);
  });
}
