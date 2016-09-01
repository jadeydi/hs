import React from 'react';
import { Link, withRouter } from 'react-router';
import http from '../network/httpclient';
import Authority from '../share/authority';
import ResponseErrors from '../share/errors';
import './users.scss';

const SignIn = withRouter (
  React.createClass({
    getInitialState: function() {
      return {identity: '', password: '', errors: []}
    },

    componentWillUnmount(e) {
      if (this.serverRequest != undefined) {
        this.serverRequest.abort();
      }
    },

    handleSubmit(e) {
      e.preventDefault();
      var {location} = this.props;
      var identity = this.state.identity.trim();
      var password = this.state.password.trim();
      this.serverRequest = http.post('/sessions', {data: {identity: identity, password: password}}).done(function(result) {
        Authority.login(result);
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

    handleInputChange(field) {
      let that = this;
      return (e)=> {
        let newState = that.state;
        newState[field] = e.target.value;
        that.setState(newState);
      }
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
              <input className='pure-input-1 field' type='text'
                name='identity' value={this.state.identity} required
                onChange={this.handleInputChange.bind(this)('identity')} />
            </div>
            <div>
              <label for="password">密码</label>
              <input className='pure-input-1 field'
                type='password' name='password'
                value={this.state.password} required
                onChange={this.handleInputChange.bind(this)('password')} />
            </div>
            <div className="register-button">
              <input type="submit" value="登录" className="pure-button pure-button-primary pure-input-1"/>
            </div>
            <div className="others">
              <Link to="/account/sign_up"> 注册-> </Link>
            </div>
          </form>
        </div>
      )
    },
  })
);

module.exports = {signIn: SignIn}
