import React from 'react';

const SignUp = React.createClass({
  getInitialState: function() {
    return {email: '', username: '', password: ''}
  },

  render() {
    return (
      <div>
        <h1> Sign Up </h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input type='email' name='email' placeholder='EMAIL' onChange={this.handleEmail} />
          </div>
          <div>
            <input type='text' name='username' min='5' placeholder='USERNAME' onChange={this.handleUsername} />
          </div>
          <div>
            <input type='password' name='password' min='6' placeholder='PASSWORD' onChange={this.handlePassword} />
          </div>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    )
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.state.username.trim();
    var email = this.state.email.trim();
    var password = this.state.password.trim();
    this.serverRequest = $.post('/account', {username: username, email: email, password: password}, function(result) {
      console.info(result);
    }.bind(this));
  },

  handleEmail: function(e) {
    this.setState({email: e.target.value});
  },

  handleUsername: function(e) {
    this.setState({username: e.target.value});
  },

  handlePassword: function(e) {
    this.setState({password: e.target.value});
  }
});

module.exports = {signUp: SignUp}
