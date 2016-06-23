import React from 'react';
import client from '../client';
import variables from '!json!../../../config/variables';


const Fact = React.createClass({
  getInitialState: function() {
    return {id: '', description: '', hero: '', created_at: ''}
  },

  componentDidMount: function() {
    this.serverRequest = client('/facts/' + this.props.params.id).done(function(result) {
      this.setState(result);
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render() {
    return (
      <div>
        <div>
          id: {this.state.id}
        </div>
        <div>
          description: {this.state.description}
        </div>
        <div>
          hero: {variables.heroes[this.state.hero]}
        </div>
        <div>
          created_at: {this.state.created_at}
        </div>
      </div>
    )
  }
});

module.exports = {fact: Fact}
