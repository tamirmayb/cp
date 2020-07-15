import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import Urls from '../util/Urls.js';

class ApplicationRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
    };
  }

  deletePost() {
    const { removePost, index, application, addError, clearErrors } = this.props;
    clearErrors();
    this.setState({
      isEditDisabled: true,
      isDeleteLoading: true,
      isDeleteDisabled: false,
    });
    axios.delete(`${Urls.api}/posts/${application.ID}`)
      .then(() => {
        removePost(index);
      },
    )
      .catch((err) => {
        addError(err.message);
      },
    );
  }

  render() {
    const { application } = this.props;
    return (
      <tr>
        <td>{application.ID}</td>
        <td>{application.Name}</td>
        <td>{application.Key}</td>
        <td>{application.Date}</td>
      </tr>
    );
  }
}

ApplicationRow.propTypes = {
  application: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Key: PropTypes.string.isRequired,
    Date: PropTypes.string.isRequired,
    ID: PropTypes.string.isRequired,
  }),
  index: PropTypes.number.isRequired,
};

export default ApplicationRow;
