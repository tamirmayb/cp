import React, { Component } from 'react';
import axios from 'axios';
import { Panel } from 'react-bootstrap/lib';
import Style from '../util/Style.js';
import Urls from '../util/Urls.js';
import ApplicationsTable from './ApplicationsTable.js';
import CreateApplication from './CreateApplication.js';
import TopNavbar from './TopNavbar.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      applications: [],
      errors: [],
    };
  }

  componentWillMount() {
    this.getApplications();
  }

  // Due to new cors restrictions it's not possible to send Cookie, I'm using Authorization header which contains the
  // cookie's data instead. If the Authorization is missing or not equal the request will fail (405)
  getApplications() {
    axios.get(`${Urls.api}/list`, {withCredentials: true, crossDomain: true,
      headers:{
        Authorization: "CHECKPOINTID=let-me-pass"
      }})
        .then((res) => {
              this.setState({ applications: res.data });
            },
        )
        .catch(() => {
              this.setState({ errors: ['Backend API connection error'] });
            },
        );
  }

  // only adds to frontend not DB todo check this!!
  addPost(post) {
    const { posts } = this.state;
    posts.push(post);
    this.setState({ posts });
  }

  render() {
    const { windowWidth, applications } = this.state;
    let width;
    if (windowWidth < Style.xsCutoff) {
      width = '100%';
    } else if (windowWidth < Style.smCutoff) {
      width = '723px';
    } else if (windowWidth < Style.mdCutoff) {
      width = '933px';
    } else {
      width = '1127px';
    }

    const panelStyle = {
      width,
      margin: 'auto',
      marginTop: '65px',
    };

    return (
        <div>
          <TopNavbar />
          <Panel style={panelStyle} bsStyle="primary">
            <h3>Applications Table</h3>
            <ApplicationsTable applications={ applications } />
            <h5>Create application</h5>
            <CreateApplication />
          </Panel>
        </div>
    );
  }
}

export default App;
