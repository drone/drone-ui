import {branch} from 'baobab-react/higher-order';
import {Link} from 'react-router';
import PageContent from '../../components/layout/content';
import React from 'react';
import {Switch} from 'react-mdl';
import {events, GET_REPO_LIST, POST_REPO, DEL_REPO} from '../../actions/events';

import './index.less';

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = { key: Math.random() };
  }


  componentDidMount() {
    events.emit(GET_REPO_LIST);
  }

  handleSwitch(repo) {
    if (repo.id > 0) {
      let confirmMsg = 'Are you sure you want to disable ' + repo.full_name + '?' +
                       '  This will DELETE the webhook, secrets and logs for this repo!';
      if (confirm(confirmMsg)) {
        events.emit(DEL_REPO, repo);
      } else {
        // Force refresh so doesn't "uncheck"
        this.setState({ key: Math.random() });
      }
    } else {
      events.emit(POST_REPO, repo);
    }
  }

  render() {
    let {user, repos, params} = this.props;
    if (!user || !repos) {
      return <div>Loading ...</div>;
    }

    if (repos.length === 0) {
      return (
          <div className="alert alert-empty">Your repository list is empty.</div>
        );
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
      });
    }

    function repoList(repo) {
      var link;
      if (repo.id) {
        link = (
          <Link to={`/${repo.owner}/${repo.name}/settings`}><i className="material-icons">settings</i></Link>
        );
      }
      return (
        <div key={repo.full_name}>
          <h3>{repo.full_name}</h3>
          <div>
            {link}
            <Switch key={this.state.key} checked={!!repo.id} onChange={this.handleSwitch.bind(this, repo)}/>
          </div>
        </div>
      );
    }

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
