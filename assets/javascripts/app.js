import '../stylesheets/app.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router'
import SignIn from './pages/sign_in';
import SignUp from './pages/sign_up';
import FactForm from './pages/fact_form';
import Fact from './pages/fact';

var Layout = React.createClass({
  render: function() {
    return (
      <div className="container">
        {this.props.main}
      </div>
    );
  }
});

const Home = React.createClass({
  render() {
    return (
      <div>
        <div>Hello Home</div>
        <div>
          <Link to='/account/sign_in'> Sign In </Link>
        </div>
        <div>
          <Link to='/account/sign_up'> Sign Up </Link>
        </div>
        <div className="detail">
          {this.props.children}
        </div>
      </div>
    )
  }
});

const NotFound = React.createClass({
  render() {
    return (
      <div> 404 </div>
    )
  }
});

$(function() {
  $('.title').css('color', 'red');

  ReactDOM.render(
    <Router history={browserHistory}>
      <Route component={Layout}>
        <Route path="/" components={{main: Home}} />
        <Route path="/account/sign_in" components={{main: SignIn.signIn}} />
        <Route path="/account/sign_up" components={{main: SignUp.signUp}} />
        <Route path="/facts/new" components={{main: FactForm.factForm}} />
        <Route path="/facts/:id" components={{main: Fact.fact}} />
      </Route>
      <Route path="*" component={NotFound} />
    </Router>,
    document.getElementById('js-container')
  );
});
