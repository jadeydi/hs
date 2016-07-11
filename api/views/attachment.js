var config = require(__dirname + '/../../config/qiniu.json');

module.exports = {
  renderAttachment(attachment) {
    return {id: attachment.id, path: config.domain + attachment.path, target_type: attachment.target_type, target_id: attachment.target_id, user_id: attachment.user_id, created_at: attachment.created_at};
  },

  renderAttachments(attachments) {
    var that = this;
    return attachments.map(function(attachment) {
      return that.renderAttachment(attachment);
    });
  }
}
