const request = require('request-promise-native');
const errorHandler = require('../custom_modules/error_handler.js');
const cheerio = require('cheerio');
const fs = require("fs");

Number.prototype.format = function () {
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {

  resource_emotes: ['', '<:wine:506517055579881472>', '<:marble:506517055739133952>', '<:crystal:506517055382618122>', '<:sulfur:506517055437275159>', '<:wood:506517055550259220>'],
  wonder_emotes: ['', '<:forge:506517054963318815>', '<:hadesholygrove:506517054992678943>', '<:demetersgarden:506517055650922497>', '<:templeofathene:506517055583944714>', '<:templeofhermes:506517055613304833>', '<:aresstronghold:506517055030296606>', '<:poseidon:506517055252725781>', '<:colossus:506517055395069952>'],

  getGuildServer: function(guildConf, message, callback) {
    try {
      if (guildConf.botMode == "server") {
        callback('server', guildConf.serverModeWorld.length != 0 ? guildConf.serverModeWorld : null);
      }
      else {
        callback('channel', guildConf.channelModeWorlds.hasOwnProperty(message.channel.id) ? guildConf.channelModeWorlds[message.channel.id] : null);
      }
    } catch (err) {
      return errorHandler.otherError(err);
    }
  },

  getIkariamRegionAndWorlds: function(iso, callback) {
    try {
      let options = {
        uri: 'http://ika-search.com/',
        transform: (body) => {
          return cheerio.load(body);
        }
      }
      request(options)
      .then((data) => {
        let $ = data;

        $('script').each((i, element) => {
          if (element.type == 'script' && element.children[0] != null) {
            if (element.children[0].data.startsWith('\n            serverInfo')) { //\n            serverInfo
              let filteredString = element.children[0].data.replace('\n            serverInfo = ', '').replace('\n        ', '');
              let ikariamRegionsObject = JSON.parse(filteredString);

              let region = ikariamRegionsObject.find(item => item[0].toLowerCase() == iso.toLowerCase() || item[1].toLowerCase() == iso.toLowerCase());
              if(!region) {
                return callback(false, ikariamRegionsObject);
              }
              else {
                return callback(true, region);
              }
            }
          }
        });

      })
      .catch((err) => {
        errorHandler.otherError(err);
      });
    } catch (err) {
      return errorHandler.otherError(err);
    }
  },

  getPlayerIds: function(iso, ikaServer, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "autocompleteList",
        iso: iso,
        server: ikaServer
      }
    }, (error, response, body) => {
      try {
        callback(JSON.parse(body).player);
      } catch (err) {
        return errorHandler.jsonParseError(err);
      }
    });
  },

  getPlayerInfo: function(iso, ikaServer, playerId, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "playerInfo",
        iso: iso,
        playerId: playerId,
        server: ikaServer
      }
    }, (error, response, body) => {
      try {
        callback(JSON.parse(body));
      } catch (err) {
        return errorHandler.jsonParseError(err);
      }
    });
  },

  getIslandInfo: function(iso, ikaServer, islandId, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "islandCities",
        iso: iso,
        islandId: islandId,
        server: ikaServer
      }
    }, (error, response, body) => {
      try {
        callback(JSON.parse(body));
      } catch (err) {
        return errorHandler.jsonParseError(err);
      }
    });
  },

  getScoresInfo: function(iso, ikaServer, playerId, scoreCategory, timeAmount, timeType, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "getScores",
        dateNum: timeAmount,
        dateType: timeType,
        index: playerId,
        iso: iso,
        scoreType: scoreCategory,
        server: ikaServer,
        type: "player"
      }
    }, (error, response, body) => {
      try {
        callback(JSON.parse(body));
      } catch (err) {
        return errorHandler.jsonParseError(err);
      }
    });
  },

  getTr: function(iso, message, callback) {
    request.post({
      url: 'http://ika-search.com/getSite.py',
      form: {
        action: 'getTr',
        iso: iso
      }
    }, (error, response, body) => {
      try {
        callback(JSON.parse(body));
      } catch (err) {
        return errorHandler.jsonParseError(err);
      }
    });
  },

  verifyPlayerName: function(iso, ikaServer, args, callback) {
    module.exports.getPlayerIds(iso, ikaServer, (playerArray) => {
      let player = playerArray.find(item => item.pseudo.toLowerCase() == args.join(' ').toLowerCase());
      try {
        if (player == null) {
          callback(false);
        }
        else {
          callback(player);
        }
      } catch (err) {
        return errorHandler.otherError(err);
      }
    });
  },

  verifyIslandCoordAndGetId: function(x_coord, y_coord, callback) {
    fs.readFile('./data/islands.json', 'UTF-8', (err, data) => {
      if (err) throw err;
      let json_data = JSON.parse(data);
      let island = json_data.islands.find(item => item.x == x_coord && item.y == y_coord);
      try {
        if (island == null) {
          callback(false);
        }
        else {
          callback(island);
        }
      } catch (err) {
        return errorHandler.otherError(err);
      }
    });
  }
};
