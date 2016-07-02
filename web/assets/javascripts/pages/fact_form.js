import React from 'react';
import client from '../client';
import { withRouter } from 'react-router';
import variables from '!json!../../../../config/variables';

const FactForm = withRouter (
  React.createClass({
    getInitialState: function() {
      return {description: '', hero: 'mage', attachments: [], attachment_ids: []}
    },

    componentDidMount: function() {
      var id = this.props.params.id;
      if ( id != undefined ) {
        this.serverRequest = client('/facts/' + id + '/edit').done(function(result) { this.setState(result);
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
                  return <option key={key} value={key}>{variables.heroes[key]}</option>
                  })}
                </select>
              </div>
              <div>
                {this.state.attachments.map(function(attachment) {
                  return <img key={attachment.id} src={attachment.path + '?imageView2/1/w/80/h/80'} />
                })}
              </div>
              <div>
                <input id="fileupload" type="file" multiple onChange={this.handleUpload} />
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
        this.serverRequest = client('/facts/'+id, 'PATCH', {description: this.state.description, hero: this.state.hero, attachment_ids: this.state.attachment_ids}).done(function(result) {
          this.props.router.replace('/facts/'+result.id);
        }.bind(this));
      } else {
        this.serverRequest = client('/facts', 'POST', {description: this.state.description, hero: this.state.hero, attachment_ids: this.state.attachment_ids}).done(function(result) {
          this.props.router.replace('/facts/'+result.id);
        }.bind(this));
      }
    },

    handleUpload: function(e) {
      var files = e.target.files;
      var file = files[0],
          that = this,
          id = this.props.params.id,
          data = {};

      if (id != undefined) {
        data.target_type = 'facts';
        data.target_id = id;
      }

      if (files && file) {
        var reader = new FileReader();

        reader.onload = function(readerEvt) {
          var binaryString = readerEvt.target.result;
          data.data = btoa(binaryString);
          this.serverRequest = client('/attachments', 'POST', data).done(function(result) {
            var arr = that.state.attachment_ids,
              attachments = that.state.attachments;
            if (!arr.includes(result.id)) {
              arr.push(result.id)
            }
            attachments.push(result);
            that.setState({attachments: attachments, attachment_ids: arr});
          }.bind(this)).always(function() {
            $('#fileupload').val('')
          });
        };

        reader.readAsBinaryString(file);
      }
    },
  })
);

module.exports = {factForm: FactForm}
