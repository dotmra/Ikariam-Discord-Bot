const request = require('request-promise-native');
const cheerio = require('cheerio');
const fs = require('fs');

Number.prototype.format = function () {
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

module.exports = {

  resource_emotes: ['', '<:wine:513831746094104597>', '<:marble:513831745867481106>', '<:crystal:513831746014281730>', '<:sulfur:513831745922007060>', '<:wood:513831746408677376> '],
  wonder_emotes: ['', '<:forge:513831745859223568>', '<:hadesholygrove:513831745708228629>', '<:demetersgarden:513831745402175492>', '<:templeofathene:513831745670348823>', '<:templeofhermes:513831745976533012>', '<:aresstronghold:513831745662091300>', '<:poseidon:513831745796177934>', '<:colossus:513831745611759657>'],
  other_emotes: ['', '<:vacation:513831745720942603>', '<:inactive:513831746249162762>'],

  getIkariamRegionAndWorld: function(guildConf, message) {
    let promise = new Promise((resolve, reject) => {
      try {
        if (guildConf.botMode == 'server') {
          resolve(['server', guildConf.botRegion, guildConf.serverModeWorld.length != 0 ? guildConf.serverModeWorld : null]);
        }
        else {
          resolve(['channel', guildConf.botRegion, guildConf.channelModeWorlds.hasOwnProperty(message.channel.id) ? guildConf.channelModeWorlds[message.channel.id] : null]);
        }
      }
      catch (err) { reject(err); }
    });
    return promise;
  },

  getIkariamRegionAndWorlds: function(iso) {
    let promise = new Promise((resolve, reject) => {
      let options = {
        uri: 'http://ika-search.com/',
        transform: (body) => {
          return cheerio.load(body);
        }
      };
      request(options)
        .then((data) => {
          let $ = data;
          $('script').each((i, element) => { // find <script> element that has the info about regions and worlds
            if (element.type == 'script' && element.children[0] != null && element.children[0].data.startsWith('\n            serverInfo')) {
              let ikariamRegionsObject = JSON.parse(element.children[0].data.replace('\n            serverInfo = ', '').replace('\n        ', ''));
              let region = ikariamRegionsObject.find(item => item[0].toLowerCase() == iso.toLowerCase() || item[1].toLowerCase() == iso.toLowerCase());
              if(!region) {
                resolve([ikariamRegionsObject, false]);
              }
              else {
                resolve([ikariamRegionsObject, region, true]);
              }
            }
          });
        })
        .catch((err) => { reject(err); });
    });
    return promise;
  },

  getPlayerAndAllianceIds: function(iso, ikaServer) {
    let promise = new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri:'http://ika-search.com/getSite.py',
        formData: {
          action: 'autocompleteList',
          iso: iso,
          server: ikaServer
        }
      };
      request(options)
        .then((body) => {
          resolve(JSON.parse(body));
        })
        .catch((err) => { reject(err); });
    });
    return promise;
  },

  getPlayerInfo: function(region, ikaWorld, playerId) {
    let promise = new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri:'http://ika-search.com/getSite.py',
        formData: {
          action: 'playerInfo',
          iso: region,
          playerId: playerId,
          server: ikaWorld
        }
      };
      request(options)
        .then((body) => {
          resolve([JSON.parse(body), region, ikaWorld]);
        })
        .catch((err) => { reject(err); });
    });
    return promise;
  },

  getAllianceInfo: function(region, ikaWorld, allianceId) {
    let promise = new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri:'http://ika-search.com/getSite.py',
        formData: {
          action: 'allyInfo',
          iso: region,
          allyId: allianceId,
          server: ikaWorld
        }
      };
      request(options)
        .then((body) => {
          resolve([JSON.parse(body), region, ikaWorld]);
        })
        .catch((err) => { reject(err); });
    });
    return promise;
  },

  getIslandInfo: function(iso, ikaServer, islandId) {
    let promise = new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri:'http://ika-search.com/getSite.py',
        formData: {
          action: 'islandCities',
          iso: iso,
          islandId: islandId,
          server: ikaServer
        }
      };
      request(options)
        .then((body) => {
          resolve(JSON.parse(body));
        })
        .catch((err) => { reject(err); });
    });
    return promise;
  },

  getScoresInfo: function(iso, ikaServer, playerObject, scoreCategory, timeAmount) {
    let promise = new Promise((resolve, reject) => {
      fs.readFile('./data/scoreTypes.json', 'UTF-8', (err, data) => {
        if (err) {
          reject(err);
        }
        let json_data = JSON.parse(data);
        let scoreTypeItem = json_data.scoreCategories.find(item => item.aliases.includes(scoreCategory.toLowerCase()));

        if (!scoreTypeItem) {
          resolve([false]);
        }
        else {
          let options = {
            method: 'POST',
            uri:'http://ika-search.com/getSite.py',
            formData: {
              action: 'getScores',
              dateNum: timeAmount,
              dateType: 'DAY',
              index: playerObject.player.id,
              iso: iso,
              scoreType: scoreTypeItem.rawName,
              server: ikaServer,
              type: 'player'
            }
          };
          request(options)
            .then((body) => {
              resolve([scoreTypeItem, playerObject, JSON.parse(body)]);
            })
            .catch((err) => { reject(err); });
        }
      });
    });
    return promise;
  },

  verifyPlayerName: function(region, ikaWorld, args) {
    let promise = new Promise((resolve, reject) => {
      module.exports.getPlayerAndAllianceIds(region, ikaWorld)
        .then((playerAndAllianceObject) => {
          try {
            let player = playerAndAllianceObject.player.find(item => item.pseudo.toLowerCase() == args.join(' ').toLowerCase());
            if (!player) {
              resolve([false, region, ikaWorld]);
            }
            else {
              resolve([player, region, ikaWorld]);
            }
          } catch (err) {
            reject(err);
          }
        })
        .catch((err) => { reject(err); });
    });
    return promise;
  },

  verifyAllianceTagOrName: function(region, ikaWorld, args) {
    let promise = new Promise((resolve, reject) => {
      module.exports.getPlayerAndAllianceIds(region, ikaWorld)
        .then((playerAndAllianceObject) => {
          try {
            let alliance = playerAndAllianceObject.ally.find(item => item.tag.toLowerCase() == args.join(' ').toLowerCase() || item.name.toLowerCase() == args.join(' ').toLowerCase());
            if (!alliance) {
              resolve([false, region, ikaWorld]);
            }
            else {
              resolve([alliance, region, ikaWorld]);
            }
          } catch (err) {
            reject(err);
          }
        })
        .catch((err) => { reject(err); });
    });
    return promise;
  },

  verifyIslandCoordAndGetId: function(region, ikariamWorld, x_coord, y_coord) {
    let promise = new Promise((resolve, reject) => {
      fs.readFile('./data/islands.json', 'UTF-8', (err, data) => {
        if (err) {
          reject(err);
        }
        let island = JSON.parse(data).islands.find(item => item.x == x_coord && item.y == y_coord);
        if (!island) {
          resolve([region, ikariamWorld, false]);
        }
        else {
          resolve([region, ikariamWorld, island]);
        }
      });
    });
    return promise;
  }
};
