import React from 'react';
import client from '../client';
import { withRouter } from 'react-router';

const GameForm = withRouter (
  React.createClass({
    getInitialState() {
      return {name: '', description: '', website: '', cover: '', coverData: '', platforms: []}
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

    handleDesc(e) {
      this.setState({description: e.target.value});
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

      this.serverRequest = client(url, method, {name: this.state.name, description: this.state.description, website: this.state.website, platforms: this.state.platforms, coverData: this.state.coverData}).done(function(result) {
        this.props.router.replace('/games/'+result.id);
      }.bind(this));
    },

    render() {
      var platformsCheckbox = ['Android', 'iOS', 'Windows'].map(function(key) {
        return (
          <label key={key} className="pure-checkbox">
            <input type="checkbox" name="platform" value={key} checked={this.state.platforms.includes(key)} onClick={this.handlePlatforms} />
            {key}
          </label>
        );
      }, this);

      return (
        <div className='game page form'>
          <form onSubmit={this.handleSubmit} className='pure-form pure-form-stacked'>
            <div>
              <label for="name">名称</label>
              <input className='pure-input-1' value={this.state.name} onChange={this.handleName} />
            </div>
            <div>
              <label className='pure-input-1' for="description">描述</label>
              <textarea className='pure-input-1 desc' value={this.state.description} onChange={this.handleDesc} />
            </div>
            <div>
              <label className='pure-input-1 website' for="website">网站</label>
              <input className='pure-input-1' value={this.state.website} onChange={this.handleWebsite} />
            </div>
            <div>
              <label className='pure-input-1 platforms' for="website">平台</label>
              {platformsCheckbox}
            </div>
            <div>
              <input className="fileupload js-fileupload" id="fileupload" type="file" multiple onChange={this.handleCover} />
            </div>
            <div>
              <input type="submit" value="提交" className='pure-input-1 pure-button pure-button-primary js-submit' />
            </div>
          </form>
        </div>
      )
    }
  })
);

module.exports = {gameForm: GameForm};
