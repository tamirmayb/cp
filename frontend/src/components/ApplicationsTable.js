import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap/lib';
import ApplicationRow from './ApplicationRow';

class ApplicationsTable extends Component {
  constructor(props) {
    super(props);
    this.state = { error: '' };
  }

  makeApplicationRows() {
    const { applications } = this.props;
    if(!applications) {
      return (
          <td colSpan={4}>Nothing to show</td>
      )
    }
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
            {this.makeApplicationRows()}
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
