import { browserHistory } from 'react-router';

module.exports = function(url) {
  $.ajaxSetup({
    headers: { 'Accept': 'application/vnd.cksity.com+json' }
  });

  return $.ajax(url).fail(function() {
    browserHistory.push('/account/sign_in');
  });
};
