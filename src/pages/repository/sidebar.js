import React from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import { getFeed } from '../../data/feed/actions';
import RepoListItem from '../../components/repo_list_item';
import { Grid, Cell, Textfield, List, ListItem } from 'react-mdl';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: ''
    };

    this.onFilter = this.onFilter.bind(this);
  }

  render() {
    let {repositories, user} = this.props;

    if (!user) {
      return (
        <div className="repository-sidebar">
          <div className="alert">
            <a href="/login">Login</a> to view your repository list.
          </div>
        </div>
      );
    }

    if (repositories.size == 0) {
      return <div>Loading...</div>;
    }

    repositories = repositories.toList()
      .filter((repository) => { // filter repositories for names that match the filtered name
        return repository.get('full_name').toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1;
      })
      .sort((a, b) => { // sort repositories by name ascending
        return (b.get('started_at') || 0) - (a.get('started_at') || 0);
      });
    return (
      <div className="repository-sidebar">
        <div className="repository-search">
          <input type="search" placeholder="Filter..." onChange={this.onFilter}/>
        </div>
        <div>
        {repositories.map((repo, index) => {
          return (
            <Link key={repo.get('full_name')} to={`/${repo.get('owner')}/${repo.get('name')}`}>
              <RepoListItem repo={repo}/>
            </Link>
          );
        })}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.dispatch(getFeed());
    // open websocket
  }

  componentWillUnmount() {
    // close websocket
  }

  onFilter(event) {
    this.setState({
      filter: event.target.value
    });
  }
}

export default connect(
  (state) => {
    if (state.drone.users.size == 0) {
      return { repositories: state.drone.feed };
    }

    const userID = state.drone.users.get('user_id');
    return {
      repositories: state.drone.feed,
      user: state.drone.users.get('entities').get(userID.toString())
    };
  }
)(Sidebar);
