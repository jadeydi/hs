import { browserHistory } from 'react-router';

const _get = function(url, options) {
  options = options || {};
  options.method = "GET";
  options.url = "/api" + url;

  return _fetch(options)
}

const _post = function(url, options) {
  options = options || {}
  options.method = "POST";
  options.url = "/api" + url;

  return _fetch(options)
}

const _put = function(url, options) {
  options = options || {}
  options.method = "PUT";
  options.url = "/api" + url;

  return _fetch(options)
}

const _delete = function(url, options) {
  options = options || {}
  options.method = "DELETE";
  options.url = "/api" + url;

  return _fetch(options)
}

const _fetch = function(options) {
  var settings = {
    headers: {
      'Accept': 'application/vnd.cksity.com+json; version=1'
    }
    , statusCode: {
      404: function() {
        browserHistory.push('/404');
      }
      , 401: function() {
        browserHistory.push('/account/sign_in');
      }
      , 500: function() {
        browserHistory.push('/500');
      }
    }
  }

  Object.assign(settings, options)

  return $.ajax(settings);
}

export default {get: _get, post: _post, put: _put, delete: _delete}
