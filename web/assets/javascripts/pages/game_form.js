import React from 'react';
import client from '../client';
import { withRouter } from 'react-router';

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

      $('.js-submit').prop('disabled', true);
      this.serverRequest = client(url, method, {name: this.state.name, description: this.state.description, website: this.state.website, platforms: this.state.platforms, coverData: this.state.coverData}).done(function(result) {
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
        cover = <div>
                  <img className='cover' src={"data:image/png;base64," + this.state.coverData} />
                </div>
      } else if (this.state.cover != null) {
        cover = <div>
                  <img className='cover' src={this.state.cover + '?imageView2/1/w/80/h/80'} />
                </div>
      } else {
        cover = <div> </div>
      }

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
            {cover}
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
