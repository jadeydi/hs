import React from 'react';

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
});

module.exports = {factForm: FactForm}
