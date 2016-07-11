import React from 'react';
import {branch} from 'baobab-react/higher-order';
import {Grid, Cell, Slider, Switch} from 'react-mdl';

import './index.less';

import {events, GET_REPO, PATCH_REPO} from '../../actions/events';
import PageContent from '../../components/layout/content';

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeout: 0
    };

    this.handleTimeoutTimeout = null;
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
    // this.handleDeleteRepository = this.handleDeleteRepository.bind(this);
  }

  componentDidMount() {
    const {owner, name} = this.props.params;
    events.emit(GET_REPO, {owner, name});
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {repository} = this.props;
    const {timeout} = this.state;
    return repository != nextProps.repository || timeout != nextState.timeout;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.timeout > 0) return;
    if (nextProps.repository) {
      this.setState({
        timeout: nextProps.repository.timeout
      });
    }
  }

  render() {
    const {repository} = this.props;

    if (repository == null) {
      return (
        <div>Loading...</div>
      );
    }

    const switches = [
      {
        key: 'allow_push',
        text: 'Push Hooks'
      },
      {
        key: 'allow_pr',
        text: 'Pull Request Hooks'
      },
      {
        key: 'allow_tags',
        text: 'Tag Hooks'
      },
      {
        key: 'allow_deploys',
        text: 'Deploy Hook'
      },
      {
        key: 'trusted',
        text: 'Trusted'
      }
    ];

    return (
      <PageContent className="repository-settings">
        {switches.map((switcher, index) => {
          return (
            <div key={index}>
              <Grid>
                <Cell phone={12} col={3}>{switcher.text}</Cell>
                <Cell phone={12} col={9}>
                  <Switch checked={repository[switcher.key]} onChange={this.handleSwitch.bind(this, switcher.key)}/>
                </Cell>
              </Grid>
              <hr/>
            </div>
          );
        })}
        <Grid>
          <Cell phone={12} col={3}>Timeout</Cell>
          <Cell phone={12} col={9}>
            <div style={{float: 'right'}}>{this.state.timeout} minutes</div>
            <Slider min={0} max={900} value={this.state.timeout} onChange={this.handleTimeout}/>
          </Cell>
        </Grid>
      </PageContent>
    );
  }

  handleSwitch(key, event) {
    const {owner, name} = this.props.params;

    let data = {owner, name};
    data[key] = event.target.checked;
    events.emit(PATCH_REPO, data);
  }

  handleTimeout(event) {
    const {owner, name} = this.props.params;
    const timeout = parseInt(event.target.value);

    clearTimeout(this.handleTimeoutTimeout);

    this.setState({
      timeout
    });

    this.handleTimeoutTimeout = setTimeout(() => {
      events.emit(PATCH_REPO, {owner, name, timeout});
    }, 500);
  }

  // handleDeleteRepository() {
  //   var confirmation = confirm('Are you sure you want to delete this repository?');
  //   if (confirmation !== false) {
  //     const {owner, name} = this.props.params;
  //     this.props.dispatch(deleteRepository(owner, name));
  //
  //     browserHistory.push('/');
  //   }
  // }
}

export default branch((props) => {
  const {owner, name} = props.params;
  return {
    repository: ['repos', owner, name]
  };
}, Content);
