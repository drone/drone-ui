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
    let {repositories} = this.props;

    if (repositories.size == 0) {
      return <div>Loading...</div>;
    }

    repositories = repositories.toList()
      .filter((repository) => { // filter repositories for names that match the filtered name
        return repository.get('full_name').toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1;
      })
      .sort((a, b) => { // sort repositories by name ascending
        return a.get('name').localeCompare(b.get('name'));
      });
    return (
      <div>
        <Textfield label="Filter..." onChange={this.onFilter}/>
        {repositories.map((repo, index) => {
          return (
            <Link key={repo.get('full_name')} to={`/${repo.get('owner')}/${repo.get('name')}`}>
              <RepoListItem repo={repo}/>
              {index < repositories.size - 1 ? <hr/> : null}
            </Link>
          );
        })}
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
  state => ({
    repositories: state.drone.feed
  })
)(Sidebar);
