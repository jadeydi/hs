import React from 'react';
import client from '../client';
import variables from '!json!../../../../config/variables';
import { Link, withRouter } from 'react-router';

const Card = withRouter (
  React.createClass({
    getInitialState: function() {
      return {current: {properties: []}}
    },

    componentDidMount: function() {
      var url = '/cards';
      if (this.props.params.id != undefined) {
        this.setState({current: {id: this.props.params.id, properties: []}})
        url = '/cards/' + this.props.params.id;
      }
      this.serverRequest = client(url).done(function(result) {
        this.setState(result);
      }.bind(this));
      window.addEventListener('keydown', this.handleKeydown, true);
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    render: function() {
      var prevLink, nextLink, properties;
      if (!!this.state.prev) {
        prevLink = <Link to={`/cards/${this.state.prev.id}`} className="fact prev js-fact-prev" onClick={this.prev}>&#8678;</Link>;
      } else {
        prevLink = <a href='javascript:;' className="fact prev disable js-fact-left">&#8678;</a>;
      }

      if (!!this.state.next) {
        nextLink = <Link to={`/cards/${this.state.next.id}`} className="fact next js-fact-next" onClick={this.next}>&#8680;</Link>;
      } else {
        nextLink = <a href='javascript:;' className="fact next disable js-fact-next">&#8680;</a>;
      }

      if (this.state.current.properties.length > 0) {
        properties = <div>
          特点:
          {this.state.current.properties.map(function(key) {
            return (
              <span key={key}>{variables.properties[key]}</span>
              )
          })}
        </div>
      } else {
        properties =  <div></div>;
      }

      return (
        <div className="card show page">
          <h1 className='title'>
            🎮  炉石传说
          </h1>
          <h4>
            {this.state.current.name}
          </h4>
          <div className='card'>
            <img src={this.state.current.cover + '?imageView2/1/w/168/h/236'}  width="168px" height="236px" className='cover'/>
            <div className='info'>
              <div className='desc'>
                {this.state.current.description}
              </div>
              <div className='other'>
                <div>
                  类型:<span>{variables.rarity[this.state.current.rarity]}</span>
                </div>
                <div>
                  职业:<span>{this.state.current.occupation}</span>
                </div>
                {properties}
              </div>
            </div>
          </div>
          <div className='action'>
            {prevLink}
            <span></span>
            {nextLink}
          </div>
        </div>
      )
    },

    prev: function() {
      if (!this.state.prev) {
        return
      }
      this.setState({prev: undefined});
      this.serverRequest = client('/cards/'+this.state.current.id+'/prev').done(function(result) {
        var obj = {next: this.state.current, current: result[0], prev: result[1]}
        this.setState(obj, function() {
          this.props.router.replace('/cards/'+this.state.current.id)
        });
      }.bind(this));
    },

    next: function() {
      if (!this.state.next) {
        return
      }
      this.setState({next: undefined});
      this.serverRequest = client('/cards/'+this.state.current.id+'/next').done(function(result) {
        var obj = {prev: this.state.current, current: result[0], next: result[1]}
        this.setState(obj, function() {
          this.props.router.replace('/cards/'+this.state.current.id)
        });
      }.bind(this));
    },

    handleKeydown: function(e) {
      if (e.keyCode == 39 || e.keyCode == 74) {
        this.next();
      } else if (e.keyCode == 37 || e.keyCode == 75) {
        this.prev();
      }
    },
  })
)

module.exports = {card: Card}
