const request = require('request-promise-native');
const fs = require("fs");

module.exports = {

  getPlayerIds: function(message, server, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "autocompleteList",
        iso: "us",
        server: server
      }
    }, (error, response, body) => {
      callback(JSON.parse(body).player);
    });
  },

  getPlayerInfo: function(message, server, playerId, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "playerInfo",
        iso: "us",
        playerId: playerId,
        server: server
      }
    }, (error, response, body) => {
      callback(JSON.parse(body));
    });
  },

  getIslandInfo: function(message, server, islandId, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "islandCities",
        iso: "us",
        islandId: islandId,
        server: server
      }
    }, (error, response, body) => {
      callback(JSON.parse(body));
    });
  },

  getScoresInfo: function(message, server, playerId, scoreCategory, timeAmount, timeType, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "getScores",
        dateNum: timeAmount,
        dateType: timeType,
        index: playerId,
        iso: "us",
        scoreType: scoreCategory,
        server: server,
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

  verifyPlayerName: function(message, server, args, callback) {
    module.exports.getPlayerIds(message, server, (playerArray) => {
      let player = playerArray.find(item => item.pseudo.toLowerCase() == args.join(' ').toLowerCase());
      if(player == null){
        callback(false);
      }
      else{
        callback(player);
      }
    });
  },

  verifyIslandCoordAndGetId: function(message, server, x_coord, y_coord, callback) {
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
