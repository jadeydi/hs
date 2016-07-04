import React from 'react';
import client from '../client';
import { withRouter } from 'react-router';
import variables from '!json!../../../../config/variables';

const FactForm = withRouter (
  React.createClass({
    getInitialState: function() {
      return {description: '', tags: 'mage', status: 'standard', attachments: [], attachment_ids: []}
    },

    componentDidMount: function() {
      var id = this.props.params.id;
      if ( id != undefined ) {
        this.serverRequest = client('/facts/' + id + '/edit').done(function(result) {
          this.setState(result);
        }.bind(this));
      }
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    render() {
      var statusRadios = Object.keys(variables.status).map(function(key) {
        return (
          <label key={key} className='pure-radio'>
            <input id="option-two" type="radio" name="status" value={key} checked={this.state.status == key} onClick={this.handleStatus} /> {variables.status[key]}
          </label>
        );
      }, this);

      return (
        <div className='fact form'>
          <form onSubmit={this.handleSubmit} className='pure-form pure-form-stacked'>
            <div>
              <textarea className='pure-input-1 desc' placeholder='DESCRIPTION' value={this.state.description} onChange={this.handleDescription} />
            </div>
            <div>
              <select className='pure-input-1' onChange={this.handleTags} value={this.state.tags}>
                {Object.keys(variables.heroes).map(function(key) {
                  return <option key={key} value={key}>{variables.heroes[key]}</option>
                  })}
                </select>
              </div>
              <div className='attachments'>
                {this.state.attachments.map(function(attachment) {
                  return <img key={attachment.id} src={attachment.path + '?imageView2/1/w/80/h/80'} />
                })}
              </div>
              <div>
                {statusRadios}
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

    handleTags: function(e) {
      this.setState({tags: e.target.value});
    },

    handleStatus: function(e) {
      this.setState({status: $(e.target).val()});
    },

    handleSubmit: function(e) {
      e.preventDefault();
      var id = this.props.params.id,
      data = {description: this.state.description, tags: this.state.tags, status: this.state.status, attachment_ids: this.state.attachment_ids};
      if (id != undefined) {
        this.serverRequest = client('/facts/'+id, 'PATCH', data).done(function(result) {
          this.props.router.replace('/facts/'+result.id);
        }.bind(this));
      } else {
        this.serverRequest = client('/facts', 'POST', data).done(function(result) {
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
