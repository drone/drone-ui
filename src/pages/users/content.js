import React from 'react';
import { connect } from 'react-redux';
import Request from 'superagent';
import { Grid, Cell, Button, Switch } from 'react-mdl';

import './index.less';

import { getUsers, createUser, updateUser, deleteUser } from '../../data/users/actions';

import PageContent from '../../components/layout/content';
import Avatar from '../../components/avatar';

import AddUserDialog from './add_user_dialog';

class Content extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      addUserDialog: {
        open: false
      }
    };

    this.handleOpenAddUserDialog = this.handleOpenAddUserDialog.bind(this);
    this.handleCancelAddUserDialog = this.handleCancelAddUserDialog.bind(this);
    this.handleAddUser = this.handleAddUser.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getUsers());
  }

  render() {
    let {user, users} = this.props;

    if (user == null || users == null) {
      return (
        <div>Loading...</div>
      );
    }

    users = users.toList().sort((a, b) => { // sort users by login
      return a.get('login').localeCompare(b.get('login'));
    });

    return (
      <PageContent className="users">
        <AddUserDialog open={this.state.addUserDialog.open}
                       onCancel={this.handleCancelAddUserDialog}
                       onAddUser={this.handleAddUser}/>
        <Grid className="actions">
          <Cell col={12}>
            <Button raised onClick={this.handleOpenAddUserDialog}>Add User</Button>
          </Cell>
        </Grid>
        <hr/>
        {users.toList().map((droneUser, index) => {
          return (
            <div key={droneUser.get('id')}>
              <Grid>
                <Cell tablet={4} col={6}>
                  <Avatar src={droneUser.get('avatar_url')} circle/>
                  <div>
                    <strong>{droneUser.get('login')}</strong><br/>
                    {droneUser.get('email')}
                  </div>
                </Cell>
                {droneUser.get('id') != user.get('id') ?
                  <Cell tablet={4} col={6} style={{textAlign: 'right'}}>
                    <Switch checked={droneUser.get('admin')}
                            onChange={this.handleToggleAdmin.bind(this, droneUser.get('login'))}>Admin</Switch>
                    <Button raised accent className="mdl-button--danger"
                            onClick={this.handleDeleteUser.bind(this, droneUser.get('login'))}>Delete</Button>
                  </Cell>
                  : null}
              </Grid>
              {index < users.size - 1 ? <hr/> : null}
            </div>
          );
        })}
      </PageContent>
    );
  }

  handleToggleAdmin(login, event) {
    this.props.dispatch(updateUser(
      login,
      {admin: event.target.checked}
    ));
  }

  handleDeleteUser(login) {
    var confirmation = confirm(`Are you sure you want to delete ${login}?`);
    if (confirmation !== false) {
      this.props.dispatch(deleteUser(login));
    }
  }

  handleOpenAddUserDialog() {
    this.toggleDialog(true);
  }

  handleCancelAddUserDialog() {
    this.toggleDialog(false);
  }

  handleAddUser(event, login) {
    this.props.dispatch(createUser(login));
    this.toggleDialog(false);
  }

  toggleDialog(open) {
    let addUserDialog = this.state.addUserDialog;
    addUserDialog.open = open;

    this.setState({
      addUserDialog
    });
  }
}

export default connect(
  (state) => {
    if (state.drone.users.size == 0) {
      return {};
    }

    const userID = state.drone.users.get('user_id');
    return {
      user: state.drone.users.get('entities').get(userID.toString()),
      users: state.drone.users.get('entities')
    };
  }
)(Content);
