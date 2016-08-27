import 'purecss/build/pure-min.css';
import 'medium-editor/src/sass/medium-editor.scss';
import 'purecss/build/grids-responsive-min.css';
import '../stylesheets/app.scss';
import 'font-awesome/css/font-awesome.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Router, Route, Link, browserHistory } from 'react-router'
import SignIn from './pages/sign_in';
import SignUp from './pages/sign_up';
import FactForm from './pages/fact_form';
import Fact from './pages/fact';
import GameForm from './pages/game_form';
import Game from './pages/game';
import Home from './pages/home';
import Card from './pages/card';
import About from './pages/about';
import Auth from './auth';
import Share from './share';

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
      <div className="container">
        { this.props.children }
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
        <Route path="facts/new" onEnter={requireAuth} component={FactForm.factForm} />
        <Route path="facts/:id/edit" onEnter={requireAuth} component={FactForm.factForm} />
        <Route path="facts/:id" component={Fact.fact} />
        <Route path="games/new" onEnter={requireAuth} component={GameForm.gameForm} />
        <Route path="games/:id/edit" onEnter={requireAuth} component={GameForm.gameForm} />
        <Route path="games/:id" component={Game.game} />
        <Route path="cards" component={Card.card} />
        <Route path="cards/:id" component={Card.card} />
      </Route>
      <Route path="/account" component={RegisterLayout}>
        <Route path="sign_in" component={SignIn.signIn} />
        <Route path="sign_up" component={SignUp.signUp} />
      </Route>
      <Route path="/500" component={Share.serverError} />
      <Route path="*" component={Share.notFound} />
    </Router>,
    document.getElementById('js-container')
  );
});
