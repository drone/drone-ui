import {branch} from 'baobab-react/higher-order';
import BuildCard from '../../components/build_card';
import {Link} from 'react-router';
import PageContent from '../../components/layout/content';
import React from 'react';
import {events, GET_REPO, GET_BUILD_LIST} from '../../actions/events';

import './index.less';

class Content extends React.Component {
  componentDidMount() {
    const {owner, name} = this.props.params;
    events.emit(GET_REPO, {owner, name});
    events.emit(GET_BUILD_LIST, {owner, name});
  }

  shouldComponentUpdate(nextProps) {
    const {repository, builds} = this.props;
    return repository != nextProps.repository || builds != nextProps.builds;
  }

  componentWillReceiveProps(nextProps) {
    const {owner, name} = this.props.params;
    const {owner: nextOwner, name: nextName} = nextProps.params;
    if (nextOwner != owner || nextName != name) {
      events.emit(GET_REPO, nextProps.params);
      events.emit(GET_BUILD_LIST, nextProps.params);
    }
  }

  render() {
    const {owner, name} = this.props.params;
    let {repository, builds} = this.props;

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
      return (
        <Link key={build.number} to={`/${owner}/${name}/${build.number}`}>
          <BuildCard build={build}/>
        </Link>
      );
    }

    return (
      <PageContent className="repository history">
        {Object.keys(builds).sort((a, b) => {return b - a;}).map(buildItem)}
      </PageContent>
    );
  }
}

export default branch((props) => {
  const {owner, name} = props.params;
  return {
    repository: ['repos', owner, name],
    builds: ['builds', owner, name]
  };
}, Content);
