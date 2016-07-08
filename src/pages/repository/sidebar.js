import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getFeed } from '../../data/feed/actions';
import { dispatchEvent } from '../../data/events/actions';
import RepoListItem from '../../components/repo_list_item';

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
      .sort((a, b) => { // sort repositories by latest build
        return (b.get('started_at') || 0) - (a.get('started_at') || 0);
      });
    return (
      <div className="repository-sidebar">
        <div className="repository-search">
          <input type="search" placeholder="Filter..." onChange={this.onFilter}/>
        </div>
        <div>
        {repositories.map((repo) => {
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

    this.ws = this.createWebSocket();
    this.ws.onmessage = function(message) {
      let event = JSON.parse(message.data);
      this.props.dispatch(dispatchEvent(event));
    }.bind(this);
  }

  componentWillUnmount() {
    this.ws.close();
  }

  createWebSocket() {
    let proto = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
    return new WebSocket(proto + '//' + window.location.host + '/ws/feed');
  }

  onFilter(event) {
    this.setState({
      filter: event.target.value
    });
  }
}

export default connect(
  (state) => {
    return {
      repositories: state.drone.feed,
      user: state.drone.user
    };
  }
)(Sidebar);
