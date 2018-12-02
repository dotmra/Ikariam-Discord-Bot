const request = require('request-promise-native');
const cheerio = require('cheerio');

module.exports = (client, defaultSettings) => {

  function getBoardsData(callback) {
    let options = {
      uri: 'https://board.us.ikariam.gameforge.com/index.php/BoardFeed/24/',
      transform: (body) => {
        return cheerio.load(body);
      }
    };
    request(options)
      .then((data) => {
        callback(data);
      })
      .catch((error) => {
        if (error.name == 'RequestError') {
          return console.log(`ENOTFOUND, Unable to get address info: ${error.message}`);
        }
      });
  }

  client.clientData.ensure('clientSettings', {
    lastGameNews: new Date()
  });

  // Uncomment below to set lastGameNews to previous time, for testing purposes
  // client.clientData.set('clientSettings', new Date(Date.parse('Tue, 29 Oct 2018 08:06:13 +0000')), 'lastGameNews');

  let lastGameNews = new Date(Date.parse(client.clientData.get('clientSettings', 'lastGameNews')));

  getBoardsData((data) => {
    let $ = data;

    $('item').each((i, element) => {
      let pubDate = element.children[7].children[0].data;
      if (new Date(Date.parse(pubDate)).getTime() > lastGameNews.getTime()) {

        client.clientData.set('clientSettings', new Date(Date.parse(pubDate)), 'lastGameNews');

        let title = element.children[1].children[0].children[0].data;
        let link = element.children[3].children[0].children[0].data;
        let description = element.children[5].children[0].children[0].data;

        let message_embed = {
          embed: {
            color: 3447003,
            author: {
              name: 'Game News!',
              icon_url: 'https://i.imgur.com/n6qhq37.png'
            },
            fields: [{
              name: `**${title}**`,
              value: `${description}\n\n${link}`
            }],
            timestamp: Date.parse(pubDate),
            footer: {
              icon_url: 'https://i.imgur.com/szyewRM.png',
              text: 'board.us.ikariam.gameforge.com'
            }
          }
        };

        client.guilds.forEach(guild => {
          client.settings.ensure(guild.id, defaultSettings);
          let newsChannelId = client.settings.get(guild.id, 'newsChannel');
          if (!newsChannelId) {
            return;
          }
          else {
            client.channels.get(newsChannelId).send(message_embed).catch((err) => {
              if(err != 'DiscordAPIError: Missing Permissions'){
                return console.error(err);
              }
              return console.log(`Posting of news message: No permission to send message to channel #${client.channels.get(newsChannelId).name} in guild '${guild.name}' (DiscordAPIError: Missing Permissions)`);
            });
            console.log(`Sent news post in guild '${guild.name}' in channel '#${client.channels.get(newsChannelId).name}'`);
          }
        });

      }
    });

  });

};
