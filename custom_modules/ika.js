const request = require('request-promise-native');
const fs = require("fs");

module.exports = {

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
