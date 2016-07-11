import {branch} from 'baobab-react/higher-order';
import {Link} from 'react-router';
import React from 'react';
import {Button, Dialog, DialogContent, DialogActions} from 'react-mdl';
import {events, GET_TOKEN, SHOW_TOKEN, HIDE_TOKEN, SYNC_REPO_LIST} from '../../actions/events';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.handleSync = this.handleSync.bind(this);
    this.handleShowToken = this.handleShowToken.bind(this);
    this.handleHideToken = this.handleHideToken.bind(this);
  }

  render() {
    let {user, repositories, token, state, params} = this.props;
    if (!user || !repositories) {
      return <div>Loading ...</div>;
    }

    let orgs = new Map();
    repositories.map(function(repo) {
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
          <Button raised ripple onClick={this.handleSync}>Sync List</Button>
        </div>
        <div className="account-list">
          {items}
        </div>

        <Dialog open={state.token}>
          <DialogContent>
            <p>Your user account token:</p>
            <pre>{token}</pre>
          </DialogContent>
          <DialogActions>
            <Button type='button' onClick={this.handleHideToken}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleSync() {
    events.emit(SYNC_REPO_LIST);
  }

  handleHideToken() {
    events.emit(HIDE_TOKEN);
  }

  handleShowToken() {
    events.emit(GET_TOKEN);
    events.emit(SHOW_TOKEN);
  }
}

export default branch({
  user: ['user'],
  token: ['token'],
  repositories: ['user', 'repos'],
  state: ['pages', 'account']
}, Sidebar);
