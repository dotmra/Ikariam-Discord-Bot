const request = require('request-promise-native');

module.exports = {
  ikaTest: function(args) {
    console.log(args.toString());
  },

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
  }
};
