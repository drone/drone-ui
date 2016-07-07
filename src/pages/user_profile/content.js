import React from 'react';
import {Grid, Cell, Button, Switch} from 'react-mdl';
import {Link} from 'react-router';
import {branch} from 'baobab-react/higher-order';

import './index.less';

import {events, GET_REPO_LIST, POST_REPO, DEL_REPO} from '../../actions/events';
import PageContent from '../../components/layout/content';

class Content extends React.Component {

  componentDidMount() {
    events.emit(GET_REPO_LIST);
  }

  handleSwitch(repo) {
    if (repo.id > 0) {
      events.emit(DEL_REPO, repo);
    } else {
      events.emit(POST_REPO, repo);
    }
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
      var link;
      if (!!repo.id) {
        link = (
          <Link to={`/${repo.owner}/${repo.name}/settings`}><i className="material-icons">settings</i></Link>
        );
      }
      return (
        <div key={repo.full_name}>
          <h3>{repo.full_name}</h3>
          <div>
            {link}
            <Switch checked={!!repo.id} onChange={this.handleSwitch.bind(this, repo)}/>
          </div>
        </div>
      );
    };

    return (
      <span>
        <PageContent className="user-profile">
          {repos.map(repoList.bind(this))}
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
