const request = require('request-promise-native');
const fs = require("fs");

Number.prototype.format = function () {
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {

  resource_emotes: ['', '<:wine:506517055579881472>', '<:marble:506517055739133952>', '<:crystal:506517055382618122>', '<:sulfur:506517055437275159>', '<:wood:506517055550259220>'],
  wonder_emotes: ['', '<:forge:506517054963318815>', '<:hadesholygrove:506517054992678943>', '<:demetersgarden:506517055650922497>', '<:templeofathene:506517055583944714>', '<:templeofhermes:506517055613304833>', '<:aresstronghold:506517055030296606>', '<:poseidon:506517055252725781>', '<:colossus:506517055395069952>'],

  getGuildServer: function(guildConf, message, callback) {
    if (guildConf.commandMode === "ALL") {
      callback(guildConf.commandModeAllServer.length != 0 ? guildConf.commandModeAllServer : null);
    }
    else {
      callback(guildConf.channelServers.hasOwnProperty(message.channel.id) ? guildConf.channelServers[message.channel.id] : null);
    }
  },

  getPlayerIds: function(ikaServer, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "autocompleteList",
        iso: "us",
        server: ikaServer
      }
    }, (error, response, body) => {
      callback(JSON.parse(body).player);
    });
  },

  getPlayerInfo: function(ikaServer, playerId, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "playerInfo",
        iso: "us",
        playerId: playerId,
        server: ikaServer
      }
    }, (error, response, body) => {
      callback(JSON.parse(body));
    });
  },

  getIslandInfo: function(ikaServer, islandId, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "islandCities",
        iso: "us",
        islandId: islandId,
        server: ikaServer
      }
    }, (error, response, body) => {
      callback(JSON.parse(body));
    });
  },

  getScoresInfo: function(ikaServer, playerId, scoreCategory, timeAmount, timeType, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "getScores",
        dateNum: timeAmount,
        dateType: timeType,
        index: playerId,
        iso: "us",
        scoreType: scoreCategory,
        server: ikaServer,
        type: "player"
      }
    }, (error, response, body) => {
      callback(JSON.parse(body));
    });
  },

  getTr: function(message, callback) {
    request.post({
      url: 'http://ika-search.com/getSite.py',
      form: {
        action: 'getTr',
        iso: 'us'
      }
    }, (error, response, body) => {
      callback(JSON.parse(body));
    });
  },

  verifyPlayerName: function(ikaServer, args, callback) {
    module.exports.getPlayerIds(ikaServer, (playerArray) => {
      let player = playerArray.find(item => item.pseudo.toLowerCase() == args.join(' ').toLowerCase());
      if(player == null){
        callback(false);
      }
      else{
        callback(player);
      }
    });
  },

  verifyIslandCoordAndGetId: function(ikaServer, x_coord, y_coord, callback) {
    fs.readFile('./data/islands.json', 'UTF-8', (err, data) => {
      if (err) throw err;
      let json_data = JSON.parse(data);
      let island = json_data.islands.find(item => item.x == x_coord && item.y == y_coord);
      if(island == null){
        callback(false);
      }
      else{
        callback(island);
      }
    });
  }
};
