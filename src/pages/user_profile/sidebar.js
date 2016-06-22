import React from 'react';
import { connect } from 'react-redux';
import Request from 'superagent';
import { Button } from 'react-mdl';
import { Link } from 'react-router';

import PageContent from '../../components/layout/content';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: ''
    };

    this.handleShowToken = this.handleShowToken.bind(this);
  }

  render() {
    let {user, repositories, params} = this.props;
    if (!user || !repositories) {
      return <div>Loading ...</div>;
    }

    repositories = repositories.toList()
      .sort((a, b) => { // sort repositories by name ascending
        return a.get('full_name').localeCompare(b.get('full_name'));
      });

    let orgs = new Map();
    repositories.map(function(repo) { // extract unique accounts from list
      orgs.set(repo.get('owner'));
    });

    let items = [];
    orgs.forEach((value, key) => {
      items.push(
        <Link key={key} to={`/account/${key}`} className={params.account == key ? "active": ""}>
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
        {this.state.token != '' ? <pre>{this.state.token}</pre>:<noscript/>}
      </div>
    );
  }

  handleShowToken() {
    Request.post(`/api/user/token`)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        this.setState({
          token: response.text
        });
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
      repositories: state.drone.repositories,
      user: state.drone.users.get('entities').get(userID.toString())
    };
  }
)(Sidebar);
