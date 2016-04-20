import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Grid, Cell, Textfield } from 'react-mdl';

import './index.less';

import { getUserRepositories } from '../../data/repositories/actions';
import RepoListItem from '../../components/repo_list_item';

import PageContent from '../../components/layout/content';

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: ''
    };

    this.onFilter = this.onFilter.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getUserRepositories());
  }

  render() {
    let {repositories} = this.props;

    if (repositories.size == 0) {
      return <div></div>;
    }

    repositories = repositories.toList()
      .filter((repository) => { // filter repositories for names that match the filtered name
        return repository.get('name').indexOf(this.state.filter) > -1;
      })
      .sort((a, b) => { // sort repositories by name ascending
        return a.get('name').localeCompare(b.get('name'));
      });

    return (
      <Grid className="dashboard">
        <Cell col={12}>
          <Textfield label="Filter..." onChange={this.onFilter}/>

          {repositories.map((repo, index) => {
            return (
              <div>{repo.get('name')}</div>
            );
          })}
        </Cell>
      </Grid>
    );

    return (
      <PageContent className="dashboard">
        <input type="search" placeholder="Filter..." onChange={this.onFilter}/>

        {repositories.map((repo, index) => {
          return (
            <Link key={repo.get('id')} to={`/${repo.get('owner')}/${repo.get('name')}`}>
              <RepoListItem repo={repo}/>
              {index < repositories.size - 1 ? <hr/> : null}
            </Link>
          );
        })}
      </PageContent>
    );
  }

  onFilter(event) {
    this.setState({
      filter: event.target.value
    });
  }
}

export default connect(
  state => ({
    repositories: state.drone.repositories
  })
)(Content);
