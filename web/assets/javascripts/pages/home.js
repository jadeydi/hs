import React from 'react';
import {withRouter} from 'react-router';
import client from '../client';

const Home = withRouter (
  React.createClass({
    getInitialState() {
      return {platforms: []};
    },

    componentDidMount() {
    },

    componentWillUnmount() {
      this.serverRequest.abort();
    },

    render() {
      return (
        <div className='game show page'>
          <div className='content'>
            <div className='info'>
              {this.state.name}
              <div>
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

module.exports = {home: Home};
