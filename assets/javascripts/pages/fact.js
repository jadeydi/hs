import React from 'react';
import client from '../client';
import variables from '!json!../../../config/variables';
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
      prevLink = <Link to={`/facts/${this.state.prev.id}`} className="hiden fact prev js-fact-prev" onClick={this.prev}><i className="fa fa-angle-left"/></Link>;
    }

    if (!!this.state.next) {
      nextLink = <Link to={`/facts/${this.state.next.id}`} className="hiden fact next js-fact-next" onClick={this.next}><i className="fa fa-angle-right"/></Link>;
    }

    return (
      <div className='fact show'>
        <h1>
          {variables.heroes[this.state.current.hero]} #{this.state.current.id}
        </h1>
        <div>
          {this.state.current.description}
        </div>
        <div>
          {this.state.current.attachments.map(function(attachment) {
            return <img key={attachment.id} src={attachment.path + '?imageView2/1/w/80/h/80'} />
          })}
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
      this.setState(obj, function() {
        if (this.state.prev == undefined) {
          $('.js-fact-prev').hide();
        }
        $('.js-fact-next').show();
      });
    }.bind(this));
  },

  next: function() {
    if (!this.state.next) {
      return
    }
    this.serverRequest = client('/facts/'+this.state.current.id+'/next').done(function(result) {
      var obj = {prev: this.state.current, current: result[0], next: result[1]}
      this.setState(obj, function() {
        if (this.state.next == undefined) {
          $('.js-fact-next').hide();
        }
        $('.js-fact-prev').show();
      });
    }.bind(this));
  }
});

module.exports = {fact: Fact}
