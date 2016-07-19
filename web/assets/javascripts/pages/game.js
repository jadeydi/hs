import React from 'react';
import {withRouter} from 'react-router';
import client from '../client';

const Game = withRouter (
  React.createClass({
    render() {
      return (
        <div>
          game
        </div>
      )
    }
  })
);

module.exports = {game: Game};
