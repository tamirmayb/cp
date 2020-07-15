import React, { Component, PropTypes } from 'react';

class ApplicationRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
    };
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
