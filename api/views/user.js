module.exports = {
  renderUser(user) {
    return {id: user.id, username: user.username, email: user.email, nickname: user.nickname, authentication_token: user.authenticationToken};
  }
}
