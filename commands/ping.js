exports.run = (client, msg, args) => {
    msg.channel.send("Pong!")
      .catch(console.error);
}
