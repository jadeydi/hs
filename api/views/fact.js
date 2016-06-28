var attachmentView = require('./attachment');

module.exports = {
  renderFact(fact) {
    var attachments = [];
    if (!!fact.attachments) {
      attachments = attachmentView.renderAttachments(fact.attachments)
    }
    return {id: fact.id, description: fact.description, hero: fact.hero, user_id: fact.user_id, created_at: fact.created_at, attachments: attachments};
  },

  renderFacts(facts) {
    return facts.map(function(fact) {
      return {id: fact.id, description: fact.description, hero: fact.hero, user_id: fact.user_id, created_at: fact.created_at};
    });
  }
}
