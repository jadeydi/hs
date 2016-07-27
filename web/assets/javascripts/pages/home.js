import React from 'react';
import {Link, withRouter} from 'react-router';
import client from '../client';

const Home = withRouter (
  React.createClass({
    getInitialState() {
      return {games: []};
    },

    componentDidMount() {
      this.serverRequest = client('/').done(function(result) {
        this.setState(result);
      }.bind(this));
    },

    componentWillUnmount() {
      this.serverRequest.abort();
    },

    render() {
      var games = this.state.games.map(function(game) {

        var platforms = game.platforms.map(function(key) {
          return <span>{key}</span>
        });

        return (
          <div key={game.id} className='pure-u-1 pure-u-md-1-2 item'>
            <div className='game'>
              <Link to={'/games/'+game.id}>
                <img src={game.cover + '?imageMogr2/auto-orient/thumbnail/!720x405r/gravity/Center/crop/720x405'} className='cover' />
              </Link>
              <div className='info'>
                <Link to={'/games/'+game.id} className='name'>
                  {game.name}
                </Link>
                <div className='platforms'>
                  {platforms}
                </div>
              </div>
            </div>
          </div>
        )
      });

      return (
        <div className='home page'>
          <div className='pure-g games'>
            {games}
          </div>
        </div>
      )
    }
  })
);

module.exports = {home: Home};
