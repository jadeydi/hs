import React from 'react';
import client from '../client';

const FactForm = React.createClass({
  getInitialState: function() {
    return {description: ''}
  },

  componentDidMount: function() {
    $('.js-fact-form').hide();
    this.serverRequest = client('/account').done(function(result) {
      $('.js-fact-form').show();
    });
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
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
});

module.exports = {factForm: FactForm}
