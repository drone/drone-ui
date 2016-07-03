import React from 'react';
import { connect } from 'react-redux';
import Request from 'superagent';
import { Grid, Cell, Button } from 'react-mdl';
import { Link } from 'react-router';
import {branch} from 'baobab-react/higher-order';

import './index.less';

import { getUserRepositories } from '../../data/repositories/actions';
import PageContent from '../../components/layout/content';

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: ''
    };

    this.handleShowToken = this.handleShowToken.bind(this);
  }

  componentDidMount() {
    // this.props.dispatch(getUserRepositories());
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
      <PageContent className="user-profile">
        {repos.map(repoList)}
      </PageContent>
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

export default branch({
  user: ['user'],
  token: ['user', 'token'],
  repos: ['user', 'repos']
}, Content);
