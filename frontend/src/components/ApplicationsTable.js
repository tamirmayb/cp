import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap/lib';
import ApplicationRow from './ApplicationRow';

class ApplicationsTable extends Component {
  constructor(props) {
    super(props);
    this.state = { error: '' };
  }

  makePostRows() {
    const { applications } = this.props;
    return applications.map((application, i) =>
      <ApplicationRow
        key={i}
        index={i}
        application={application}
      />,
    );
  }

  render() {
    return (
      <div style={{ marginTop: '10px' }}>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Key</th>
              <th>Creation Time</th>
            </tr>
          </thead>
          <tbody>
            {this.makePostRows()}
          </tbody>
        </Table>
      </div>
    );
  }
}

ApplicationsTable.propTypes = {
  applications: PropTypes.arrayOf(PropTypes.object),
};

export default ApplicationsTable;
