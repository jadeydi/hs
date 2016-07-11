var attachmentView = require('./attachment');

module.exports = {
  renderFact(fact) {
    var attachments = [];
    if (!!fact.attachments) {
      attachments = attachmentView.renderAttachments(fact.attachments)
    }
    return {id: fact.id, description: fact.description, tags: fact.tags, status: fact.status, user_id: fact.user_id, created_at: fact.created_at, attachments: attachments};
  },

  renderFacts(facts) {
    var that = this;
    return facts.map(function(fact) {
      return that.renderFact(fact);
    });
  }
}
