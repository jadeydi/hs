import React from 'react';
import client from '../client';
import { browserHistory } from 'react-router';
import variables from '!json!../../../config/variables';

const FactForm = React.createClass({
  getInitialState: function() {
    return {description: '', hero: 'mage'}
  },

  render() {
    return (
      <div className='js-fact-form'>
        <form onSubmit={this.handleSubmit}>
          <div>
            <textarea placeholder='DESCRIPTION' value={this.state.description} onChange={this.handleDescription} />
          </div>
          <div>
            <select onChange={this.handleHero}>
              {Object.keys(variables.heroes).map(function(key) {
                return <option value={key}>{variables.heroes[key]}</option>
                })}
              </select>
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

  handleHero: function(e) {
    this.setState({hero: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.serverRequest = client('/facts', 'POST', {description: this.state.description, hero: this.state.hero}).done(function(result) {
      browserHistory.push('/facts/'+result.id);
    }.bind(this));
  },
});

module.exports = {factForm: FactForm}
