import React from 'react';
import { withRouter } from 'react-router';
import Auth from '../auth';
import Client from '../client';

const SignUp = withRouter (
  React.createClass({
    getInitialState: function() {
      return {email: '', username: '', nickname: '', password: ''}
    },

    render() {
      return (
        <div className='account sign_up'>
          <form onSubmit={this.handleSubmit} className='pure-form pure-form-stacked'>
            <div>
              <input className='pure-input-1' type='email' name='email' placeholder='邮箱' onChange={this.handleEmail} />
            </div>
            <div>
              <input className='pure-input-1' type='text' name='username' min='5' placeholder='用户名' onChange={this.handleUsername} />
            </div>
            <div>
              <input className='pure-input-1' type='text' name='nickname' min='5' placeholder='昵称' onChange={this.handleNickname} />
            </div>
            <div>
              <input className='pure-input-1' type='password' name='password' min='6' placeholder='密码' onChange={this.handlePassword} />
            </div>
            <div>
              <input type="submit" value="注册" className="pure-button pure-input-1 pure-button-primary" />
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
