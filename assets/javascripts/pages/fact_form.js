import React from 'react';
import client from '../client';
import { browserHistory } from 'react-router';

const FactForm = React.createClass({
  getInitialState: function() {
    return {description: ''}
  },

  render() {
    return (
      <div className='js-fact-form'>
        <form onSubmit={this.handleSubmit}>
          <div>
            <textarea name='description' placeholder='DESCRIPTION' value={this.state.description} onChange={this.handleDescription} />
          </div>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    )
  },

  handleDescription: function(e) {
    this.setState({description: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.serverRequest = client('/facts', 'POST', {description: this.state.description}).done(function(result) {
      browserHistory.push('/facts/'+result.id);
    }.bind(this));
  },
});

module.exports = {factForm: FactForm}
