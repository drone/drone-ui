import React from 'react';
import {browserHistory} from 'react-router';
import {branch} from 'baobab-react/higher-order';
import {Grid, Cell, Button, Slider, Switch} from 'react-mdl';

import './index.less';

import {events, GET_REPO} from '../../actions/events';
import PageContent from '../../components/layout/content';

import {
  getRepository,
  updateRepository,
  deleteRepository
} from '../../data/repositories/actions';

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeout: 0
    };

    this.handleTimeoutTimeout = null;
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
    this.handleDeleteRepository = this.handleDeleteRepository.bind(this);
  }

  componentDidMount() {
    const {owner, name} = this.props.params;
    events.emit(GET_REPO, {owner, name});
  }

  shouldComponentUpdate(nextProps) {
    const {repository} = this.props;
    return repository != nextProps.repository;
  }

  componentWillUpdate(nextProps) {
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
        key: 'private',
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
        {/*
        <Grid className="danger-zone">
          <Cell col={12}>
            <h4>Danger Zone</h4>
          </Cell>
          <Cell phone={12} col={3}>
            <Button raised ripple accent className="mdl-button--danger"
                    onClick={this.handleDeleteRepository}>Delete</Button>
          </Cell>
          <Cell phone={12} col={9}>
            Permanently deletes the build history.<br/>
            <strong>This action cannot be undone.</strong>
          </Cell>
        </Grid>*/}
      </PageContent>
    );
  }

  handleSwitch(key, event) {
    const {owner, name} = this.props.params;

    let data = {};
    data[key] = event.target.checked;

    this.props.dispatch(updateRepository(owner, name, data));
  }

  handleTimeout(event) {
    const {owner, name} = this.props.params;
    const timeout = parseInt(event.target.value);

    clearTimeout(this.handleTimeoutTimeout);

    this.setState({
      timeout
    });

    this.handleTimeoutTimeout = setTimeout(() => {
      this.props.dispatch(updateRepository(owner, name, {timeout}));
    }, 500);
  }

  handleDeleteRepository() {
    var confirmation = confirm('Are you sure you want to delete this repository?');
    if (confirmation !== false) {
      const {owner, name} = this.props.params;
      this.props.dispatch(deleteRepository(owner, name));

      browserHistory.push('/');
    }
  }
}

export default branch((props, context) => {
  const {owner, name} = props.params;
  return {
    repository: ['repos', owner, name]
  }
}, Content);
