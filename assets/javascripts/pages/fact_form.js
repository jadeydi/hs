import React from 'react';
import client from '../client';
import { withRouter } from 'react-router';
import variables from '!json!../../../config/variables';

const FactForm = withRouter (
  React.createClass({
    getInitialState: function() {
      return {description: '', hero: 'mage'}
    },

    componentDidMount: function() {
      var id = this.props.params.id;
      if ( id != undefined ) {
        this.serverRequest = client('/facts/' + id).done(function(result) {
          this.setState(result);
        }.bind(this));
      }
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    render() {
      return (
        <div className='fact form'>
          <form onSubmit={this.handleSubmit} className='pure-form pure-form-stacked'>
            <div>
              <textarea className='pure-input-1 desc' placeholder='DESCRIPTION' value={this.state.description} onChange={this.handleDescription} />
            </div>
            <div>
              <select className='pure-input-1' onChange={this.handleHero} value={this.state.hero}>
                {Object.keys(variables.heroes).map(function(key) {
                  return <option value={key}>{variables.heroes[key]}</option>
                })}
              </select>
            </div>
            <div>
              <input type="submit" value="Submit" className='pure-input-1 pure-button pure-button-primary' />
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
      var id = this.props.params.id;
      if (id != undefined) {
        this.serverRequest = client('/facts/'+id, 'PATCH', {description: this.state.description, hero: this.state.hero}).done(function(result) {
          this.props.router.replace('/facts/'+result.id);
        }.bind(this));
      } else {
        this.serverRequest = client('/facts', 'POST', {description: this.state.description, hero: this.state.hero}).done(function(result) {
          this.props.router.replace('/facts/'+result.id);
        }.bind(this));
      }
    },
  })
);

module.exports = {factForm: FactForm}
