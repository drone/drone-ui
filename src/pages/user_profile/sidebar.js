import React from 'react';
import { connect } from 'react-redux';
import Request from 'superagent';
import { Button, Dialog, DialogContent, DialogActions } from 'react-mdl';
import { Link } from 'react-router';
import {branch} from 'baobab-react/higher-order';

import PageContent from '../../components/layout/content';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: ''
    };

    this.handleShowToken = this.handleShowToken.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  render() {
    let {user, repositories, params} = this.props;
    if (!user || !repositories) {
      return <div>Loading ...</div>;
    }

    // repositories = repositories.toList()
    //   .sort((a, b) => { // sort repositories by name ascending
    //     return a.get('full_name').localeCompare(b.get('full_name'));
    //   });

    let orgs = new Map();
    repositories.map(function(repo) { // extract unique accounts from list
      orgs.set(repo.owner);
    });

    let items = [];
    orgs.forEach((value, key) => {
      items.push(
        <Link key={key} to={`/account/${key}`} className={params.account == key ?'active': ''}>
          <div>{key}</div>
        </Link>
      );
    });

    return (
      <div>
        <div className="account-actions">
          <Button raised ripple onClick={this.handleShowToken}>Show Token</Button>
          <Button raised ripple>Sync List</Button>
        </div>
        <div className="account-list">
          {items}
        </div>

        <Dialog open={this.state.openDialog}>
          <DialogContent>
            <p>Your user account token:</p>
            <pre>{this.state.token}</pre>
          </DialogContent>
          <DialogActions>
            <Button type='button' onClick={this.handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleOpenDialog() {
     this.setState({
       openDialog: true
     });
   }

   handleCloseDialog() {
     this.setState({
       openDialog: false
     });
   }

  handleShowToken() {
    Request.post(`/api/user/token`)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        this.setState({
          openDialog: true,
          token: response.text
        });
      });
  }
}

export default branch({
  user: ['user'],
  repositories: ['user', 'repos']
}, Sidebar);
