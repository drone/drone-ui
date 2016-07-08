import React from 'react';
import { connect } from 'react-redux';
import Request from 'superagent';

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
    this.props.dispatch(getUserRepositories());
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

    if (params.account) {
      repositories = repositories.filter((a) => {
        return params.account == a.get('owner');
      });
    }

    return (
      <PageContent className="user-profile">
        {repositories.map((repo) => {
          return <div key={repo.get('full_name')}>{repo.get('full_name')}</div>;
        })}
      </PageContent>
    );
  }

  handleShowToken() {
    Request.post('/api/user/token')
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
    return {
      repositories: state.drone.repositories,
      user: state.drone.user
    };
  }
)(Content);
