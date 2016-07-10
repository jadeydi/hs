var models = require('../models');
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('/Users/stone/Ruby/projects/grab_cards/qiniu_new_cards')
});

lineReader.on('line', function (line) {
  var arr = line.split("|")
  models.cards.create({name: arr[0], name_en: arr[1], rarity: arr[2], cover: arr[3], properties: arr[4].split("#"), description: arr[5], occupation: arr[6], card_type: arr[7], mana: arr[8], attack: arr[9], health: arr[10]})
});
