import { browserHistory } from 'react-router';

module.exports = function(url, method, data) {
  $.ajaxSetup({
    headers: {
      'Accept': 'application/vnd.cksity.com+json'
    }
  });

  var method = method || "GET";
  var data = data || {}
  return $.ajax({
    url: '/api' + url
    , method: method
    , data: data
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
  });
};
