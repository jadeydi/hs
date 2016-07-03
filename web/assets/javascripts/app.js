import 'purecss/build/pure-min.css';
import '../stylesheets/app.scss';
import 'font-awesome/css/font-awesome.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Router, Route, Link, browserHistory } from 'react-router'
import SignIn from './pages/sign_in';
import SignUp from './pages/sign_up';
import FactForm from './pages/fact_form';
import Fact from './pages/fact';
import About from './pages/about';
import Auth from './auth';
import Share from './share';

var Layout = React.createClass({
  render: function() {
    return (
      <div>
        <div className="container">
          { this.props.children }
        </div>
        <div className="footer">
          <div className="content">
            <Link to='/'>cksixty.com</Link> &copy;2016
            <Link to='/about'>关于网站</Link>
          </div>
        </div>
      </div>
    );
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
        <IndexRoute component={Fact.fact} />
        <Route path="/about" component={About.about} />
        <Route path="account/sign_in" component={SignIn.signIn} />
        <Route path="account/sign_up" component={SignUp.signUp} />
        <Route path="facts/new" onEnter={requireAuth} component={FactForm.factForm} />
        <Route path="facts/:id/edit" onEnter={requireAuth} component={FactForm.factForm} />
        <Route path="facts/:id" component={Fact.fact} />
      </Route>
      <Route path="/500" component={Share.serverError} />
      <Route path="*" component={Share.notFound} />
    </Router>,
    document.getElementById('js-container')
  );
});
