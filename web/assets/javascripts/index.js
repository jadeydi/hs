import 'purecss/build/pure-min.css';
import 'medium-editor/src/sass/medium-editor.scss';
import 'purecss/build/grids-responsive-min.css';
import '../stylesheets/index.scss';
import 'font-awesome/css/font-awesome.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Router, Route, Link, browserHistory } from 'react-router'
import Account from './users/account';
import SignIn from './users/sign_in';
import SignUp from './users/sign_up';
import Home from './pages/home';
import About from './pages/about';
import Authority from './share/authority';
import Status from './share/status';

var Layout = React.createClass({
  render: function() {
    return (
      <div>
        <div className="header">
          <Link to='/'> 恐怖时钟 </Link>
        </div>
        <div className="container">
          { this.props.children }
        </div>
        <div className="footer">
          <div className="content">
            &copy;2016 All Rights Reserved
            <Link to='/about' className="about">About Us</Link>
          </div>
        </div>
      </div>
    );
  }
});

var RegisterLayout = React.createClass({
  render: function() {
    return (
      <div>
        <div className="session-header">
          <Link to="/">
            <img src="/images/clock.png" className="logo" />
          </Link>
        </div>
        <div className="container">
          { this.props.children }
        </div>
      </div>
    )
  }
});

function requireAuth(nextState, replace) {
  if (!Auth.loggedIn()) {
    replace({
      pathname: '/account/sign_in',
      state: { nextPathname: nextState.location.pathname }
    });
  }
};

$(function() {
  ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={Home.home} />
        <Route path="/about" component={About.about} />
        <Route path="/account" component={Account.account} />
      </Route>
      <Route path="/account" component={RegisterLayout}>
        <Route path="sign_in" component={SignIn.signIn} />
        <Route path="sign_up" component={SignUp.signUp} />
      </Route>
      <Route path="/500" component={Status.serverError} />
      <Route path="*" component={Status.notFound} />
    </Router>,
    document.getElementById('js-container')
  );
});
