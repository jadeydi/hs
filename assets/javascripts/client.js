import { browserHistory } from 'react-router';

module.exports = function(url, method, data) {
  $.ajaxSetup({
    headers: { 'Accept': 'application/vnd.cksity.com+json' }
  });

  var method = method || "GET";
  var data = data || {}
  return $.ajax({url: url, method: method, data: data}).fail(function() {
    browserHistory.push('/account/sign_in');
  });
};
