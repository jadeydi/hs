import React from 'react';
import { Link } from 'react-router'

const Spinner = React.createClass({
  render() {
    return (
      <div className={"sk-circle " + this.props.attr }>
        <div className="sk-circle1 sk-child"></div>
        <div className="sk-circle2 sk-child"></div>
        <div className="sk-circle3 sk-child"></div>
        <div className="sk-circle4 sk-child"></div>
        <div className="sk-circle5 sk-child"></div>
        <div className="sk-circle6 sk-child"></div>
        <div className="sk-circle7 sk-child"></div>
        <div className="sk-circle8 sk-child"></div>
        <div className="sk-circle9 sk-child"></div>
        <div className="sk-circle10 sk-child"></div>
        <div className="sk-circle11 sk-child"></div>
        <div className="sk-circle12 sk-child"></div>
      </div>
    )
  }
});

const NotFound = React.createClass({
  render() {
    return (
      <div className='error page'>
        <h1>
          404
        </h1>
        <div className='content'>
          额~ &nbsp; What are you looking for? &nbsp;
          <Link to='/'>Home?</Link>
        </div>
      </div>
    )
  }
});

const ServerError = React.createClass({
  render() {
    return (
      <div className='error page'>
        <h1>
          500
        </h1>
        <div className='content'>
          额~ &nbsp; I can't handle it! &nbsp;
          <Link to='/'>So back Home?</Link>
        </div>
      </div>
    )
  }
});

module.exports = {notFound: NotFound, serverError: ServerError, spinner: Spinner}
