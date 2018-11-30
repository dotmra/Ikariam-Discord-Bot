const request = require('request-promise-native');
const errorHandler = require('../custom_modules/error_handler.js');
const cheerio = require('cheerio');
const fs = require("fs");

Number.prototype.format = function () {
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {

  resource_emotes: ['', '<:wine:513831746094104597>', '<:marble:513831745867481106>', '<:crystal:513831746014281730>', '<:sulfur:513831745922007060>', '<:wood:513831746408677376> '],
  wonder_emotes: ['', '<:forge:513831745859223568>', '<:hadesholygrove:513831745708228629>', '<:demetersgarden:513831745402175492>', '<:templeofathene:513831745670348823>', '<:templeofhermes:513831745976533012>', '<:aresstronghold:513831745662091300>', '<:poseidon:513831745796177934>', '<:colossus:513831745611759657>'],
  other_emotes: ['', '<:vacation:513831745720942603>', '<:inactive:513831746249162762>'],

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

  getPlayerIds: async function(iso, ikaServer) {
    let promise = new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri:'http://ika-search.com/getSite.py',
        formData: {
          action: "autocompleteList",
          iso: iso,
          server: ikaServer
        }
      }
      request(options)
        .then((body) => {
          if (body.startsWith('"error"')) {
            console.log("TRUE 1");
            reject('error');
          }
          else {
            resolve(JSON.parse(body));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
    return await promise;
  },

  getPlayerInfo: async function(iso, ikaServer, playerId) {
    let promise = new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri:'http://ika-search.com/getSite.py',
        formData: {
          action: "playerInfo",
          iso: iso,
          playerId: playerId,
          server: ikaServer
        }
      }
      request(options)
        .then((body) => {
          if (body.startsWith('"error"')) {
            reject('error');
          }
          else {
            resolve(JSON.parse(body));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
    return await promise;
  },

  getIslandInfo: async function(iso, ikaServer, islandId) {
    let promise = new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri:'http://ika-search.com/getSite.py',
        formData: {
          action: "islandCities",
          iso: iso,
          islandId: islandId,
          server: ikaServer
        }
      }
      request(options)
        .then((body) => {
          resolve(JSON.parse(body));
        })
        .catch((err) => {
          reject(err);
        });
    });
    return await promise;
  },

  getScoresInfo: async function(iso, ikaServer, playerId, scoreCategory, timeAmount, timeType) {
    let promise = new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri:'http://ika-search.com/getSite.py',
        formData: {
          action: "getScores",
          dateNum: timeAmount,
          dateType: timeType,
          index: playerId,
          iso: iso,
          scoreType: scoreCategory,
          server: ikaServer,
          type: "player"
        }
      }
      request(options)
        .then((body) => {
          resolve(JSON.parse(body));
        })
        .catch((err) => {
          reject(err);
        });
    });
    return await promise;
  },

  verifyPlayerName: async function(iso, ikaServer, args) {
    let promise = new Promise((resolve, reject) => {

      module.exports.getPlayerIds(iso, ikaServer)
      .then((playerArray) => {
        try {
          let player = playerArray.player.find(item => item.pseudo.toLowerCase() == args.join(' ').toLowerCase());
          if (player == null) {
            resolve(false);
          }
          else {
            resolve(player);
          }
        } catch (err) {
          reject(err);
        }
      })
      .catch((err) => {
        reject(err);
      });
    });

    return await promise;
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
