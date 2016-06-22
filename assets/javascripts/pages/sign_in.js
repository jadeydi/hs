import React from 'react';
import { browserHistory } from 'react-router';

const SignIn = React.createClass({
  getInitialState: function() {
    return {identity: '', password: ''}
  },

  render() {
    return (
      <div>
        <h1> Sign In </h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input type='text' name='identity' placeholder='USERNAME, EMAIL' value={this.state.identity} onChange={this.handleIdentity} />
          </div>
          <div>
            <input type='password' name='password' placeholder='PASSWORD' value={this.state.password} onChange={this.handlePassword} />
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
    var identity = this.state.identity.trim();
    var password = this.state.password.trim();
    $.ajaxSetup({
      headers: { 'Accept': 'application/vnd.cksity.com+json' }
    });
    this.serverRequest = $.post('/session', {identity: identity, password: password}, function(result) {
      browserHistory.push('/');
    }.bind(this));
  },

  handleIdentity: function(e) {
    this.setState({identity: e.target.value});
  },

  handlePassword: function(e) {
    this.setState({password: e.target.value});
  },
});

module.exports = {signIn: SignIn}
