import React from 'react';
import client from '../client';
import variables from '!json!../../../../config/variables';
import { Link } from 'react-router';

const Fact = React.createClass({
  getInitialState: function() {
    return {current: {attachments: []}}
  },

  componentDidMount: function() {
    var url = '/';
    if (this.props.params.id != undefined) {
      this.setState({current: {id: this.props.params.id, attachments: []}})
      url = '/facts/' + this.props.params.id;
    }
    this.serverRequest = client(url).done(function(result) {
      this.setState(result, function() {
        if (!!this.state.prev) {
          $('.js-fact-prev').show();
        }
        if (!!this.state.next) {
          $('.js-fact-next').show();
        }
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render() {
    var prevLink, nextLink;
    if (!!this.state.prev) {
      prevLink = <Link to={`/facts/${this.state.prev.id}`} className="fact prev js-fact-prev" onClick={this.prev}><i className="fa fa-arrow-circle-o-left"/></Link>;
    } else {
      prevLink = <a href='javascript:;' className="fact next disable js-fact-left"><i className="fa fa-arrow-circle-o-left"/></a>;
    }

    if (!!this.state.next) {
      nextLink = <Link to={`/facts/${this.state.next.id}`} className="fact next js-fact-next" onClick={this.next}><i className="fa fa-arrow-circle-o-right"/></Link>;
    } else {
      nextLink = <a href='javascript:;' className="fact next disable js-fact-next"><i className="fa fa-arrow-circle-o-right"/></a>;
    }

    return (
      <div className='fact show'>
        <h1 className='title'>炉石传说</h1>
        <h2 className='num'>
          <span className='symbol'>#</span><span>{this.state.current.id}</span>
        </h2>
        <div>
          {this.state.current.description}
        </div>
        <div>
          {this.state.current.attachments.map(function(attachment) {
            return <img key={attachment.id} src={attachment.path + '?imageView2/1/w/80/h/80'} />
          })}
        </div>
        <div className='tags'>
          标签: <span>{variables.heroes[this.state.current.hero]}</span>
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
    this.serverRequest = client('/facts/'+this.state.current.id+'/prev').done(function(result) {
      var obj = {next: this.state.current, current: result[0], prev: result[1]}
      this.setState(obj);
    }.bind(this));
  },

  next: function() {
    if (!this.state.next) {
      return
    }
    this.serverRequest = client('/facts/'+this.state.current.id+'/next').done(function(result) {
      var obj = {prev: this.state.current, current: result[0], next: result[1]}
      this.setState(obj);
    }.bind(this));
  }
});

module.exports = {fact: Fact}
