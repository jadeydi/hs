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
        <div className='account sign_up'>
          <form onSubmit={this.handleSubmit} className='pure-form pure-form-stacked'>
            <div>
              <input className='pure-input-1' type='email' name='email' placeholder='EMAIL' onChange={this.handleEmail} />
            </div>
            <div>
              <input className='pure-input-1' type='text' name='username' min='5' placeholder='USERNAME' onChange={this.handleUsername} />
            </div>
            <div>
              <input className='pure-input-1' type='password' name='password' min='6' placeholder='PASSWORD' onChange={this.handlePassword} />
            </div>
            <div>
              <input type="submit" value="Submit" className="pure-button pure-input-1 pure-button-primary" />
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
