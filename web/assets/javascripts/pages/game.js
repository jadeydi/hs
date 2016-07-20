import React from 'react';
import {withRouter} from 'react-router';
import client from '../client';

const Game = withRouter (
  React.createClass({
    getInitialState() {
      return {platforms: []};
    },

    componentDidMount() {
      this.serverRequest = client(`/games/${this.props.params.id}`).done(function(result) {
        this.setState(result);
      }.bind(this));
    },

    componentWillUnmount() {
      this.serverRequest.abort();
    },

    render() {
      var cover;
      if (this.state.cover != null) {
        cover = <img src={this.state.cover + '?imageView2/1/w/720/h/405'} className='cover'/>
      } else {
        cover = <div></div>;
      }

      var platforms = this.state.platforms.map(function(key) {
        return <span>{key}</span>
      });

      return (
        <div className='game show page'>
          {cover}
          <div className='content'>
            <div className='info'>
              <h1>
                {this.state.name}
              </h1>
              <div className='platforms'>
                {platforms}
              </div>
            </div>
            <div className='body'>
              {this.state.description}
            </div>
          </div>
        </div>
      )
    }
  })
);

module.exports = {game: Game};
