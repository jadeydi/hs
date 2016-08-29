module.exports = {
  login(obj) {
    localStorage.setItem("current_user", obj);
  },

  loggedIn() {
    return !!localStorage.current_user
  }
}
