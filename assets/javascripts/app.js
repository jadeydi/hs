import '../stylesheets/app.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router'
import SignIn from './pages/sign_in';
import SignUp from './pages/sign_up';
import FactForm from './pages/fact_form';
import Fact from './pages/fact';
import Home from './pages/home';
import Auth from './auth';

var Layout = React.createClass({
  render: function() {
    return (
      <div className="container">
        {this.props.main}
      </div>
    );
  }
});

const NotFound = React.createClass({
  render() {
    return (
      <div> 404 </div>
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
      <Route component={Layout}>
        <Route path="/" components={{main: Home.home}} />
        <Route path="/account/sign_in" components={{main: SignIn.signIn}} />
        <Route path="/account/sign_up" components={{main: SignUp.signUp}} />
        <Route path="/facts/new" onEnter={requireAuth} components={{main: FactForm.factForm}} />
        <Route path="/facts/:id" components={{main: Fact.fact}} />
      </Route>
      <Route path="*" component={NotFound} />
    </Router>,
    document.getElementById('js-container')
  );
});
