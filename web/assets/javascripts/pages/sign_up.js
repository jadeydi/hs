import React from 'react';
import { withRouter } from 'react-router';
import Auth from '../auth';
import Client from '../client';
import ResponseErrors from '../share/errors';
import { Link } from 'react-router';

const SignUp = withRouter (
  React.createClass({
    getInitialState: function() {
      return {email: '', username: '', nickname: '', password: '', errors: []}
    },

    render() {
      var errorsHtml = "";
      if (this.state.errors.length > 0) {
        errorsHtml = <ResponseErrors errors={this.state.errors} />;
      }

      return (
        <div className='account sign_up'>
          {errorsHtml}
          <form onSubmit={this.handleSubmit} className='pure-form pure-form-stacked'>
            <div>
              <label for="email">邮箱</label>
              <input className='pure-input-1 field' type='email' name='email' required onChange={this.handleEmail} />
            </div>
            <div>
              <label for="username">用户名(合法字符: a-zA-z0-9_，最少3位)</label>
              <input className='pure-input-1 field' type='text' name='username' pattern='[a-zA-Z0-9][a-zA-Z0-9_]{2,31}' required onChange={this.handleUsername} />
            </div>
            <div>
              <label for="nickname">昵称</label>
              <input className='pure-input-1 field' type='text' name='nickname' onChange={this.handleNickname} />
            </div>
            <div>
              <label for="password">密码(最少6位)</label>
              <input className='pure-input-1 field' type='password' name='password' pattern='.{6,}' required onChange={this.handlePassword} />
            </div>
            <div className="register-button">
              <input type="submit" value="注册" className="pure-button pure-input-1 pure-button-primary" />
            </div>
            <div className="others">
              <Link to="/account/sign_in"> 登录-> </Link>
            </div>
          </form>
        </div>
      )
    },

    handleSubmit: function(e) {
      e.preventDefault();
      var {location} = this.props;
      var username = this.state.username.trim();
      var nickname = this.state.nickname.trim();
      var email = this.state.email.trim();
      var password = this.state.password.trim();
    this.serverRequest = Client('/account', 'POST', {username: username, nickname: nickname, email: email, password: password}).done(function(result) {
        Auth.login(result);
        if (location.state && location.state.nextPathname) {
          this.props.router.replace(location.state.nextPathname)
        } else {
          this.props.router.replace('/')
        }
      }.bind(this)).fail(function(jqXHR, textStatus) {
        if (jqXHR.status == 422) {
          this.setState({errors: jqXHR.responseJSON.errors});
        }
      }.bind(this));
    },

    handleEmail: function(e) {
      this.setState({email: e.target.value});
    },

    handleUsername: function(e) {
      this.setState({username: e.target.value});
    },

    handleNickname: function(e) {
      this.setState({nickname: e.target.value});
    },

    handlePassword: function(e) {
      this.setState({password: e.target.value});
    }
  })
);

module.exports = {signUp: SignUp}
