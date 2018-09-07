const request = require('request-promise-native');
const fs = require("fs");

module.exports = {

  getPlayerIds: function(callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "autocompleteList",
        iso: "us",
        server: "Dionysos"
      }
    }, (error, response, body) => {
      callback(JSON.parse(body).player);
    });
  },

  getPlayerInfo: function(playerId, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "playerInfo",
        iso: "us",
        playerId: playerId,
        server: "Dionysos"
      }
    }, (error, response, body) => {
      callback(JSON.parse(body));
    });
  },

  getIslandInfo: function(islandId, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "islandCities",
        iso: "us",
        islandId: islandId,
        server: "Dionysos"
      }
    }, (error, response, body) => {
      callback(JSON.parse(body));
    });
  },

  getScoresInfo: function(playerId, scoreCategory, timeAmount, timeType, callback) {
    request.post({
      url:'http://ika-search.com/getSite.py',
      form: {
        action: "getScores",
        dateNum: timeAmount,
        dateType: timeType,
        index: playerId,
        iso: "us",
        scoreType: scoreCategory,
        server: "Dionysos",
        type: "player"
      }
    }, (error, response, body) => {
      callback(JSON.parse(body));
    });
  },

  getTr: function(callback) {
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

  verifyPlayerName: function(args, callback) {
    module.exports.getPlayerIds((playerArray) => {
      let player = playerArray.find(item => item.pseudo.toLowerCase() == args.join(' ').toLowerCase());
      if(player == null){
        callback(false);
      }
      else{
        callback(player);
      }
    });
  },

  verifyIslandCoordAndGetId: function(x_coord, y_coord, callback) {
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
