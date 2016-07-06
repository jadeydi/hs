import React from 'react';
import client from '../client';
import { withRouter } from 'react-router';
import variables from '!json!../../../../config/variables';
import Share from '../share';

const FactForm = withRouter (
  React.createClass({
    getInitialState: function() {
      return {description: '', tags: [], status: 'standard', attachments: [], attachment_ids: []}
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
      var tagsCheckbox = Object.keys(variables.heroes).map(function(key) {
        return (
          <label key={key} className="pure-checkbox">
            <input type="checkbox" name="tags" value={key} checked={this.state.tags.includes(key)} onClick={this.handleTags} />
            {variables.heroes[key]}
          </label>
        );
      }, this);

      var statusRadios = Object.keys(variables.status).map(function(key) {
        return (
          <label key={key} className='pure-radio'>
            <input type="radio" name="status" value={key} checked={this.state.status == key} onClick={this.handleStatus} /> {variables.status[key]}
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
              {tagsCheckbox}
            </div>
            <div className='attachments'>
              {this.state.attachments.map(function(attachment) {
                return (
                  <img key={attachment.id} src={attachment.path + '?imageView2/1/w/80/h/80'} />
                  )
              })}
            </div>
            <div>
              {statusRadios}
            </div>
            <div>
              <input className="fileupload js-fileupload" id="fileupload" type="file" multiple onChange={this.handleUpload} />
              <Share.spinner attr="small js-spinner" />
            </div>
            <div>
              <input type="submit" value="Submit" className='pure-input-1 pure-button pure-button-primary js-submit' />
            </div>
          </form>
        </div>
      )
    },

    handleDescription: function(e) {
      this.setState({description: e.target.value});
    },

    handleStatus: function(e) {
      this.setState({status: $(e.target).val()});
    },

    handleTags: function(e) {
      var tags,
      obj = $(e.target);
      console.info(obj.is(':checked'));
      console.info(obj.val());
      if (obj.is(':checked')) {
        this.state.tags.push(obj.val());
        tags = this.state.tags;
      } else {
        var i = this.state.tags.indexOf(obj.val());
        this.state.tags.splice(i, 1);
        tags = this.state.tags;
      }
      this.setState({tags: tags});
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

        this.toggleUpload(true)
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
            $('#fileupload').val('');
            that.toggleUpload(false);
          }.bind(this));
        };

        reader.readAsBinaryString(file);
      }
    },

    toggleUpload: function(state) {
      if (state) {
        $('.js-fileupload').prop('disabled', true);
        $('.js-submit').prop('disabled', true);
        $('.js-spinner').css('display', 'inline-block');
      } else {
        $('.js-submit').prop('disabled', false);
        $('.js-fileupload').prop('disabled', false);
        $('.js-spinner').hide();
      }
    }
  })
);

module.exports = {factForm: FactForm}
