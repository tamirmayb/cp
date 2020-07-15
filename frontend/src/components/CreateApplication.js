import React, { Component } from 'react';
import axios from 'axios';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap/lib';
import Urls from '../util/Urls.js';

//todo complete isLoading and errors

class CreateApplication extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false, name: '', key: '', isLoading: false, errors: [] };
  }

  handleChange(key, e) {
    const newState = {};
    newState[key] = e.target.value;
    this.setState(newState);
  }

  checkInput() {
    const errors = [];
    if (this.state.name.length === 0) {
      errors.push('Name cannot be blank.');
    }

    if (this.state.key.length === 0) {
      errors.push('Key cannot be blank.');
    }

    return errors;
  }

  // Due to new cors restrictions it's not possible to send Cookie, I'm using Authorization header which contains the
  // cookie's data instead. If the Authorization is missing or not equal the request will fail (405)
  createApplication() {
    const { name, key } = this.state;
    this.setState({ isLoading: true, errors: [] });
    const errors = this.checkInput();
    if (errors.length === 0) {
      axios.post(`${Urls.api}/add`, {
        Name: name,
        Key: key,
      }, {
          withCredentials: true,
          crossDomain: true,
            headers:{
              Authorization: "CHECKPOINTID=let-me-pass"
        }})
          .then((res) => {
                // this.props.addApp(res.data);
                this.setState({ isLoading: false, name: '', key: '', errors: [] });
              },
          )
          .catch((err) => {
                this.setState({ isLoading: false, errors: [err.message] });
              },
          );
    } else {
      this.setState({ isLoading: false, errors });
    }
  }

  render() {
    return (
        <div>
          <form>
            <FormGroup>
              <ControlLabel>Name</ControlLabel>
              <FormControl
                  type="text"
                  value={this.state.name}
                  placeholder="Enter application name"
                  onChange={this.handleChange.bind(this, 'name')}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Key</ControlLabel>
              <FormControl
                  type="text"
                  value={this.state.key}
                  placeholder="Enter application key"
                  onChange={this.handleChange.bind(this, 'key')}
              />
            </FormGroup>
            <FormGroup>
              <Button onClick={this.createApplication.bind(this)}>
                Create Application
              </Button>
            </FormGroup>
          </form>
        </div>
    );
  }
}

export default CreateApplication;
