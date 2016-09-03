import React from 'react';
import http from '../network/httpclient';
import Authority from '../share/authority';
import ResponseErrors from '../share/errors';
import { Link, withRouter } from 'react-router';
import './users.scss';

const Account = withRouter (
  React.createClass({
    getInitialState() {
      return {email: '', username: '', nickname: '', old_password: '', password: '', errors: [], success: false}
    },

    componentDidMount(e) {
      this.serverRequest = http.get('/account').done(function(result) {
        this.setState(result)
      }.bind(this));
    },

    componentWillUnmount(e) {
      if (this.serverRequest != undefined) {
        this.serverRequest.abort();
      }
    },

    handleInputChange(field) {
      let that = this;
      return (e)=> {
        let newState = that.state;
        newState[field] = e.target.value;
        that.setState(newState);
      }
    },

    handleSubmit(e) {
      e.preventDefault();

      var username = this.state.username.trim();
      var nickname = this.state.nickname.trim();
      var oldPassword = this.state.old_password.trim();
      var password = this.state.password.trim();
      this.serverRequest = http.put('/account', {data: {username: username, nickname: nickname, old_password: oldPassword, password: password}}).done(function(result) {
        Object.assign(result, {password: "", old_password: "", success: true});
        this.setState(result);
      }.bind(this)).fail(function(jqXHR, textStatus) {
        if (jqXHR.status == 422) {
          this.setState({errors: jqXHR.responseJSON.errors, success: false});
        }
      }.bind(this));
    },

    render() {
      var errorsHtml = "";
      if (this.state.errors.length > 0) {
        errorsHtml = <ResponseErrors errors={this.state.errors} />;
      }

      var successHtml = "";
      if (this.state.success) {
        successHtml = <div className='update success'> 更新成功 </div>;
      }

      return (
        <div className='account me'>
          {successHtml}
          {errorsHtml}
          <form onSubmit={this.handleSubmit} className='pure-form pure-form-stacked'>
            <div>
              <label for="email">邮箱 (暂时不可更改)</label>
              <input className='pure-input-1 field' type='email' name='email' value={this.state.email} />
            </div>
            <div>
              <label for="username">用户名(合法字符: a-zA-z0-9_，最少3位)</label>
              <input className='pure-input-1 field' type='text' name='username' pattern='[a-zA-Z0-9][a-zA-Z0-9_]{2,31}' required onChange={this.handleInputChange.bind(this)('username')} value={this.state.username} />
            </div>
            <div>
              <label for="nickname">昵称</label>
              <input className='pure-input-1 field' type='text' name='nickname' onChange={this.handleInputChange.bind(this)('nickname')} value={this.state.nickname} />
            </div>

            <div className='divider'></div>

            <div>
              <label for="old_password">旧密码(更新密码时需要)</label>
              <input className='pure-input-1 field' type='password' name='old_password' pattern='.{6,}' onChange={this.handleInputChange.bind(this)('old_password')} value={this.state.old_password} />
            </div>
            <div>
              <label for="password">密码(最少6位)</label>
              <input className='pure-input-1 field' type='password' name='password' pattern='.{6,}' onChange={this.handleInputChange.bind(this)('password')} value={this.state.password} />
            </div>
            <div className="register-button">
              <input type="submit" value="更新个人信息" className="pure-button pure-input-1 pure-button-primary" />
            </div>
          </form>
        </div>
      )
    }
  })
);

module.exports = {account: Account}
