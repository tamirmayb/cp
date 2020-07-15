import React, { Component } from 'react';
import axios from 'axios';
import { Panel } from 'react-bootstrap/lib';
import Style from '../util/Style.js';
import Urls from '../util/Urls.js';
import ApplicationsTable from './ApplicationsTable.js';
import CreatePostButton from './CreatePostButton.js';
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

  getApplications() {
    axios.get(`${Urls.api}/list`)
      .then((res) => {
        this.setState({ applications: res.data });
      },
    )
      .catch(() => {
        this.setState({ errors: ['Backend API connection error'] });
      },
    );
  }

  // only adds to frontend not DB
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
          <h2>Applications Table</h2>
          <CreatePostButton addPost={this.addPost.bind(this)} />
          <ApplicationsTable applications={ applications } />
        </Panel>
      </div>
    );
  }
}

export default App;
