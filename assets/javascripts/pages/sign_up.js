import React from 'react';
import { withRouter } from 'react-router';
import Auth from '../auth';
import Client from '../client';

const SignUp = withRouter (
  React.createClass({
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
      var {location} = this.props;
      var username = this.state.username.trim();
      var email = this.state.email.trim();
      var password = this.state.password.trim();
      this.serverRequest = Client('/account', 'POST', {username: username, email: email, password: password}).done(function(result) {
        Auth.login(result);
        if (location.state && location.state.nextPathname) {
          this.props.router.replace(location.state.nextPathname)
        } else {
          this.props.router.replace('/')
        }
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
  })
);

module.exports = {signUp: SignUp}
