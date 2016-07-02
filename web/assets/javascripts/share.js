import React from 'react';
import { Link } from 'react-router'

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

module.exports = {notFound: NotFound, serverError: ServerError}
