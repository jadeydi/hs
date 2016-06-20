import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router'

const Users = React.createClass({
  render() {
    return (
      <div>
        <div>Hello Users</div>
        <div>
          <Link to='/'> Home </Link>
        </div>
      </div>
    )
  }
});

module.exports = {users: Users}
