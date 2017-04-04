import {branch} from 'baobab-react/higher-order';
import BuildCard from '../../components/build_card';
import {Link} from 'react-router';
import PageContent from '../../components/layout/content';
import React from 'react';
// import Select from 'react-select';
import {events, GET_REPO, GET_BUILD_LIST, BUILD_FILTER, BUILD_FILTER_CLEAR,
        BUILD_FILTER_SUGGESTIONS_CLEAR} from '../../actions/events';

import './index.less';

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.onFilter = this.onFilter.bind(this);
  }

  componentDidMount() {
    const {owner, name} = this.props.params;
    events.emit(GET_REPO, {owner, name});
    events.emit(GET_BUILD_LIST, {owner, name});
    // if filter param is present in query string then use it
    // e.g. ?filter=status:success;author:foo;event:deployment
    const value = this.props.location.query.filter;
    if(value) {
      events.emit(BUILD_FILTER, value);
    }
  }

  componentWillUnmount() {
    events.emit(BUILD_FILTER_CLEAR);
    events.emit(BUILD_FILTER_SUGGESTIONS_CLEAR);
  }

  shouldComponentUpdate(nextProps) {
    const {repository, builds, state} = this.props;
    return repository != nextProps.repository || builds != nextProps.builds || state != nextProps.state;
  }

  componentWillReceiveProps(nextProps) {
    const {owner, name} = this.props.params;
    const {owner: nextOwner, name: nextName} = nextProps.params;
    if (nextOwner != owner || nextName != name) {
      events.emit(GET_REPO, nextProps.params);
      events.emit(GET_BUILD_LIST, nextProps.params);
      events.emit(BUILD_FILTER_CLEAR);
    }
  }

  onFilter(value) {
    events.emit(BUILD_FILTER, value);
  }

  render() {
    const {owner, name} = this.props.params;
    // let {repository, builds, filtered_builds, state} = this.props;
    let {repository, builds} = this.props;

    if (repository instanceof Error) {
      return (
        <div className="alert alert-empty">This repository is not found. You might need to login first.</div>
      );
    }

    if (!repository || !builds) {
      return (
        <div>Loading...</div>
      );
    }

    if (!builds || Object.keys(builds).length == 0) {
      return (
        <div className="alert alert-empty">This repository does not have any builds yet.</div>
      );
    }

    function buildItem(number) {
      const build = builds[number];
      if (build instanceof Error) return null;
      return (
        <Link key={build.number} to={`/${owner}/${name}/${build.number}`}>
          <BuildCard build={build}/>
        </Link>
      );
    }

    return (
      <PageContent className="repository history">
        {/* TODO this needs to be re-enabled. It was failing with errors
            and temporarily commented out.

          <Select multi simpleValue
          value={(state && state.build_filter) ? state.build_filter : ''}
          placeholder='Filter build history...'
          options={(state && state.suggestions) ? state.suggestions : []}
          delimiter=';'
          onChange={this.onFilter} />
        {Object.keys(filtered_builds).sort((a, b) => {return b - a;}).map(buildItem)}
        */}
        {Object.keys(builds).sort((a, b) => {return b - a;}).map(buildItem)}
      </PageContent>
    );
  }

}

export default branch((props) => {
  const {owner, name} = props.params;
  return {
    repository: ['repos', owner, name],
    builds: ['builds', owner, name],
    filtered_builds: ['filtered_builds', owner, name],
    state: ['pages', 'repo']
  };
}, Content);
