import React from 'react';
import {browserHistory, Link} from 'react-router';
import {branch} from 'baobab-react/higher-order';
import {events, GET_FEED} from '../../actions/events';

import RepoListItem from '../../components/repo_list_item';
import {Grid, Cell, Textfield, List, ListItem} from 'react-mdl';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: ''
    };

    this.onFilter = this.onFilter.bind(this);
  }

  render() {
    let {feed, user} = this.props;

    if (!user) {
      return (
        <div className="repository-sidebar">
          <div className="alert">
            <a href="/login">Login</a> to view your repository list.
          </div>
        </div>
      );
    }

    if (feed.length == 0) {
      return <div>Loading...</div>;
    }

    // repositories = repositories.toList()
    //   .filter((repository) => { // filter repositories for names that match the filtered name
    //     return repository.get('full_name').toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1;
    //   })
    //   .sort((a, b) => { // sort repositories by latest build
    //     return (b.get('started_at') || 0) - (a.get('started_at') || 0);
    //   });
    return (
      <div className="repository-sidebar">
        <div className="repository-search">
          <input type="search" placeholder="Filter..." onChange={this.onFilter}/>
        </div>
        <div>
        {feed.map((repo, index) => {
          return (
            <Link key={repo.full_name} to={`/${repo.owner}/${repo.name}`}>
              <RepoListItem repo={repo}/>
            </Link>
          );
        })}
        </div>
      </div>
    );
  }

  componentDidMount() {
    // this.props.dispatch(getFeed());
    events.emit(GET_FEED);
    // this.ws = this.createWebSocket();
    // this.ws.onmessage = function(message) {
    //   let event = JSON.parse(message.data);
    //   this.props.dispatch(dispatchEvent(event));
    // }.bind(this)
  }
  //
  // componentWillUnmount() {
  //   this.ws.close();
  // }
  //
  // createWebSocket() {
  //   let proto = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
  //   return new WebSocket(proto + '//' + window.location.host + '/ws/feed');
  // }

  onFilter(event) {
    this.setState({
      filter: event.target.value
    });
  }
}

export default branch({
  feed: ['feed'],
  user: ['user']
}, Sidebar);
