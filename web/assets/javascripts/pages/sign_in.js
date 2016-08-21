import React from 'react';
import { withRouter } from 'react-router';
import Auth from '../auth';
import client from '../client';
import ResponseErrors from '../share/errors';

const SignIn = withRouter (
  React.createClass({
    getInitialState: function() {
      return {identity: '', password: '', errors: []}
    },

    render() {
      var errorsHtml = "";
      if (this.state.errors.length > 0) {
        errorsHtml = <ResponseErrors errors={this.state.errors} />;
      }

      return (
        <div className='account sign_in'>
          {errorsHtml}
          <form onSubmit={this.handleSubmit} className='pure-form pure-form-stacked'>
            <div>
              <label for="email">用户名 / 邮箱</label>
              <input className='pure-input-1' type='text' name='identity' value={this.state.identity} required onChange={this.handleIdentity} />
            </div>
            <div>
              <label for="password">密码</label>
              <input className='pure-input-1' type='password' name='password' value={this.state.password} required onChange={this.handlePassword} />
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
      }.bind(this)).fail(function(jqXHR, textStatus) {
        if (jqXHR.status == 401) {
          this.setState({errors: ["username_or_password_invalid"]});
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
