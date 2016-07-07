import React from 'react';
import {Grid, Cell, Button} from 'react-mdl';
import {Link} from 'react-router';
import {branch} from 'baobab-react/higher-order';

import './index.less';

import {events, GET_REPO_LIST} from '../../actions/events';
import PageContent from '../../components/layout/content';

class Content extends React.Component {

  componentDidMount() {
    events.emit(GET_REPO_LIST);
  }

  render() {
    let {user, repos, token, params} = this.props;
    if (!user || !repos) {
      return <div>Loading ...</div>;
    }

    // sort repositories by name ascending
    // TODO move this to the data handler
    repos.slice(0).sort((a, b) => {
        return a.full_name.localeCompare(b.full_name);
      });

    // filter repositories by owner
    if (params.account) {
      repos = repos.filter((repo) => {
        return params.account == repo.owner;
      })
    }

    function repoList(repo) {
      return <div key={repo.full_name}>{repo.full_name}</div>;
    }

    return (
      <span>
        <PageContent className="user-profile">
          {repos.map(repoList)}
        </PageContent>
      </span>
    );
  }
}

export default branch({
  user: ['user'],
  token: ['user', 'token'],
  repos: ['user', 'repos']
}, Content);
