import '../css/app.scss';
import React from 'react';
import ReactDOM from 'react-dom';

$(function() {
  $('.title').css('color', 'red');

  ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('container')
  );
});
