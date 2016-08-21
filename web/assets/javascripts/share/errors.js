import React from 'react';
import UserTrans from '../../../../config/localizion/users.json';

const ResponseErrors = React.createClass({
  render() {
    var errorsList = this.props.errors.map(function(error) {
      return (
        <li key={error}>
          {UserTrans[error]}
        </li>
      )
    });

    return (
      <div className="errors error_messages">
        <ul>
          {errorsList}
        </ul>
      </div>
    )
  }
});

export default ResponseErrors;
