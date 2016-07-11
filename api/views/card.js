var config = require(__dirname + '/../../config/qiniu.json');

module.exports = {
  renderCard: function(card) {
    return {id: card.id, name: card.name, rarity: card.rarity, cover: config.domain + card.cover, properties: card.properties, description: card.description, occupation: card.occupation};
  },

  renderCards: function(cards) {
    var that = this;
    return cards.map(function(card) {
      return that.renderCard(card);
    })
  }
}
