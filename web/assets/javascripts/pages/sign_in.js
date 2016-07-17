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
        <div className='account sign_in'>
          <form onSubmit={this.handleSubmit} className='pure-form pure-form-stacked'>
            <div>
              <input className='pure-input-1' type='text' name='identity' placeholder='用户名, 邮箱' value={this.state.identity} onChange={this.handleIdentity} />
            </div>
            <div>
              <input className='pure-input-1' type='password' name='password' placeholder='密码' value={this.state.password} onChange={this.handlePassword} />
            </div>
            <div>
              <input type="submit" value="登录" className="pure-button pure-button-primary pure-input-1"/>
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
