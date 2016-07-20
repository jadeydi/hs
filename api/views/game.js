var config = require(__dirname + '/../../config/qiniu.json');

module.exports = {
  renderGame(body) {
    return {name: body.name, description: body.description, website: body.website, platforms: [].concat(body["platforms[]"])}
  },

  renderGameView(game) {
    var data = {id: game.id, name: game.name, description: game.description, website: game.website, platforms: game.platforms}
    if (game.cover != null) {
      data.cover = config.domain + game.cover;
    }
    return data
  },

  renderGameViews(games) {
    var that = this;
    return games.map(function(game) {
      return that.renderGameView(game);
    });
  }
}
