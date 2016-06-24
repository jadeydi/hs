import React from 'react';
import { withRouter } from 'react-router';
import Auth from '../auth';
import client from '../client';

const SignIn = withRouter (
  React.createClass({
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
      var {location} = this.props;
      var identity = this.state.identity.trim();
      var password = this.state.password.trim();
      this.serverRequest = client('/session', 'POST', {identity: identity, password: password}).done(function(result) {
        Auth.login(result);
        if (location.state && location.state.nextPathname) {
          this.props.router.replace(location.state.nextPathname)
        } else {
          this.props.router.replace('/')
        }
      }.bind(this));
    },

    handleIdentity: function(e) {
      this.setState({identity: e.target.value});
    },

    handlePassword: function(e) {
      this.setState({password: e.target.value});
    },
  })
);

module.exports = {signIn: SignIn}
