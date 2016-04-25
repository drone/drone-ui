import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Textfield } from 'react-mdl';

export default
class AddUserDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: ''
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleAddUser = this.handleAddUser.bind(this);
  }

  render() {
    const {open, onCancel} = this.props;

    return (
      <Dialog open={open} onCancel={onCancel}>
        <DialogTitle>New User</DialogTitle>
        <DialogContent>
          <Textfield label="Username" placeholder="E.g. octocat" floatingLabel
                     value={this.state.username}
                     onChange={this.handleUsernameChange}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleAddUser}>Add</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value
    });
  }

  handleAddUser(event) {
    this.props.onAddUser(event, this.state.username);
  }
}
