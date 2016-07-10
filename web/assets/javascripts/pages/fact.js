import React from 'react';
import client from '../client';
import variables from '!json!../../../../config/variables';
import qiniu from '!json!../../../../config/qiniu';
import { Link, withRouter } from 'react-router';

const Image = React.createClass({
  render() {
    return (
      <img src={this.props.url + '?imageView2/1/w/80/h/80'} data-url={this.props.url + '?imageView2/2/w/1000/h/700'} onClick={this.enlargeImage} width='80px' height='80px' />
    )
  },

  enlargeImage: function(e) {
    $('.js-image-container').html('<img src="'+$(e.target).data('url')+'" />');
    $('.js-image-modal').show();
  },
});

const Fact = withRouter (
  React.createClass({
    getInitialState: function() {
      return {current: {tags: [], attachments: []}}
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

      window.addEventListener('keydown', this.handleKeydown, true);
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    render() {
      var prevLink, nextLink;
      if (!!this.state.prev) {
        prevLink = <Link to={`/facts/${this.state.prev.id}`} className="fact prev js-fact-prev" onClick={this.prev}>&#8678;</Link>;
      } else {
        prevLink = <a href='javascript:;' className="fact prev disable js-fact-left">&#8678;</a>;
      }

      if (!!this.state.next) {
        nextLink = <Link to={`/facts/${this.state.next.id}`} className="fact next js-fact-next" onClick={this.next}>&#8680;</Link>;
      } else {
        nextLink = <a href='javascript:;' className="fact next disable js-fact-next">&#8680;</a>;
      }

      var description = this.state.current.description;
      if (description != undefined) {
        description = description.replace(/(?:\r\n|\r|\n)/g, '<br />');
      }

      return (
        <div className='fact show'>
          <h1 className='title'>
            🎮  炉石传说
          </h1>
          <h2 className='num'>
            <span className='decoration'>
              <span className='symbol'>#</span><span>{this.state.current.id}</span>
            </span>
          </h2>
          <div dangerouslySetInnerHTML={{__html: description}}>
          </div>
          <div className='images'>
            {this.state.current.attachments.map(function(attachment) {
              return <Image key={attachment.id} url={attachment.path}/>
              })}
            </div>
            <div className='tags other'>
              <span className='decoration'>
                职业:
                {this.state.current.tags.map(function(key) {
                  return (
                    <span key={key}>{variables.heroes[key]}</span>
                    )
                })}
              </span>
            </div>
            <div className='status other'>
              <span className='decoration'>
                适用:<span>{variables.status[this.state.current.status]}</span>
              </span>
            </div>
            <div className='action'>
              {prevLink}
              <span></span>
              {nextLink}
            </div>
            <div className='hiden image-modal js-image-modal'>
              <div className='close'>
                <a href='javascript:;' onClick={this.hidenImageModal}>✕</a>
              </div>
              <div className='image-container js-image-container'>
                <img src="http://o9dhmjmlm.bkt.clouddn.com/attachments/a9adb472-53d7-4460-830e-281a72876729.png?imageView2/2/w/1000/h/700" />
              </div>
            </div>
          </div>
      )
    },

    prev: function() {
      if (!this.state.prev) {
        return
      }
      this.setState({prev: undefined});
      this.serverRequest = client('/facts/'+this.state.current.id+'/prev').done(function(result) {
        var obj = {next: this.state.current, current: result[0], prev: result[1]}
        this.setState(obj, function() {
          this.props.router.replace('/facts/'+this.state.current.id)
        });
      }.bind(this));
    },

    next: function() {
      if (!this.state.next) {
        return
      }
      this.setState({next: undefined});
      this.serverRequest = client('/facts/'+this.state.current.id+'/next').done(function(result) {
        var obj = {prev: this.state.current, current: result[0], next: result[1]}
        this.setState(obj, function() {
          this.props.router.replace('/facts/'+this.state.current.id)
        });
      }.bind(this));
    },

    hidenImageModal: function() {
      $('.js-image-modal').hide();
    },

    handleKeydown: function(e) {
      if (e.keyCode == 39 || e.keyCode == 74) {
        this.next();
      } else if (e.keyCode == 37 || e.keyCode == 75) {
        this.prev();
      }
    },
  })
);

module.exports = {fact: Fact}
