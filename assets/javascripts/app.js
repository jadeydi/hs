import 'purecss/build/pure-min.css';
import '../stylesheets/app.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Router, Route, Link, browserHistory } from 'react-router'
import SignIn from './pages/sign_in';
import SignUp from './pages/sign_up';
import FactForm from './pages/fact_form';
import Fact from './pages/fact';
import Auth from './auth';

var Layout = React.createClass({
  render: function() {
    return (
      <div className="container">
        { this.props.children }
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
      <Route path= '/' component={Layout}>
        <IndexRoute component={Fact.fact} />
        <Route path="account/sign_in" component={SignIn.signIn} />
        <Route path="account/sign_up" component={SignUp.signUp} />
        <Route path="facts/new" onEnter={requireAuth} component={FactForm.factForm} />
        <Route path="facts/:id/edit" onEnter={requireAuth} component={FactForm.factForm} />
        <Route path="facts/:id" component={Fact.fact} />
      </Route>
      <Route path="*" component={NotFound} />
    </Router>,
    document.getElementById('js-container')
  );
});
