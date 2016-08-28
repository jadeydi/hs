import React from 'react';
import client from '../network/httpclient';
import { withRouter } from 'react-router';
import Editor from './editor'
import {ContentState, convertFromHTML} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';

const GameForm = withRouter (
  React.createClass({
    getInitialState() {
      return {name: '', description: '', website: '', cover: null, coverData: null, platforms: []}
    },

    componentDidMount() {
      var id = this.props.params.id;
      if (id != undefined) {
        this.serverRequest = client(`/games/${id}/edit`).done(function(result) {
          this.setState(result);
        }.bind(this));
      }
    },

    componentWillUnmount() {
      this.serverRequest.abort();
    },

    handleName(e) {
      this.setState({name: e.target.value});
    },

    handleWebsite(e) {
      this.setState({website: e.target.value});
    },

    handlePlatforms(e) {
      var platforms,
      obj = $(e.target);
      if (obj.is(':checked')) {
        this.state.platforms.push(obj.val());
        platforms = this.state.platforms;
      } else {
        var i = this.state.platforms.indexOf(obj.val());
        this.state.platforms.splice(i, 1);
        platforms = this.state.platforms;
      }
      this.setState({platforms: platforms});
    },

    handleCover(e) {
      var files = e.target.files;
      var file = files[0],
          that = this;

      if (files && file) {
        var reader = new FileReader();

        reader.onload = function(readerEvt) {
          var binaryString = readerEvt.target.result;
          that.setState({coverData: btoa(binaryString)});
        };

        reader.readAsBinaryString(file);
      }
    },

    handleSubmit(e) {
      e.preventDefault();
      var id = this.props.params.id,
        method = 'POST',
        url = '/games';
      if (id != undefined) {
        method = 'PATCH';
        url = '/games/' + id;
      }

      $('.js-submit').prop('disabled', true);
      this.serverRequest = client(url, method, {name: this.state.name, description: $('.rich-editor .text-editor').html(), website: this.state.website, platforms: this.state.platforms, coverData: this.state.coverData}).done(function(result) {
        this.props.router.replace('/games/'+result.id);
      }.bind(this)).always(function() {
        $('.js-fileupload').prop('disabled', false);
      });
    },

    render() {
      var platformsCheckbox = ['iPhone', 'Android', 'iPad', 'Windows'].map(function(key) {
        return (
          <label key={key} className="pure-checkbox">
            <input type="checkbox" name="platform" value={key} checked={this.state.platforms.includes(key)} onClick={this.handlePlatforms} />
            {key}
          </label>
        );
      }, this);

      var cover;
      if (this.state.coverData != null && this.state.coverData != '') {
        cover = <div> <img className='cover' src={"data:image/png;base64," + this.state.coverData} /> </div>
      } else if (this.state.cover != null) {
        cover = <div> <img className='cover' src={this.state.cover + '?imageView2/1/w/80/h/80'} /> </div>
      } else {
        cover = <div> </div>
      }

      return (
        <div className='page form game'>
          <form onSubmit={this.handleSubmit} className='pure-form pure-form-stacked'>
            <div>
              <label for="name">Name</label>
              <input className='pure-input-1' value={this.state.name} onChange={this.handleName} />
            </div>
            <div>
              <label className='pure-input-1' for="description">Description</label>
              <div className='rich-editor long-article'>
                <Editor.richEditor value={this.state.description} />
              </div>
            </div>
            <div>
              <label className='pure-input-1 website' for="website">Website</label>
              <input className='pure-input-1' value={this.state.website} onChange={this.handleWebsite} />
            </div>
            <div>
              <label className='pure-input-1 platforms' for="website">Platforms</label>
              {platformsCheckbox}
            </div>
            <div>
              <input className="fileupload js-fileupload" id="fileupload" type="file" multiple onChange={this.handleCover} />
            </div>
            {cover}
            <div>
              <input type="submit" value="Submit" className='pure-input-1 pure-button pure-button-primary js-submit' />
            </div>
          </form>
        </div>
      )
    }
  })
);

module.exports = {gameForm: GameForm};
