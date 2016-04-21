import React from 'react';
import { connect } from 'react-redux';
import { Grid, Cell, Slider, Switch } from 'react-mdl';

import './index.less';

import PageContent from '../../components/layout/content';

import { getRepository, getRepositoryKey, updateRepository } from '../../data/repositories/actions';

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeout: 0
    };

    this.handleTimeoutTimeout = null;
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
  }

  componentDidMount() {
    const {owner, name} = this.props.params;
    this.props.dispatch(getRepository(owner, name));
    this.props.dispatch(getRepositoryKey(owner, name));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.repository) {
      this.setState({
        timeout: nextProps.repository.get('timeout')
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
                  <Switch checked={repository.get(switcher.key)} onChange={this.handleSwitch.bind(this, switcher.key)}/>
                </Cell>
              </Grid>
              <hr/>
            </div>
          );
        })}
        <Grid>
          <Cell phone={12} col={3}>Timeout in Minutes</Cell>
          <Cell phone={12} col={9}>
            <div style={{float: 'right'}}>{this.state.timeout} minutes</div>
            <Slider min={0} max={900} value={this.state.timeout} onChange={this.handleTimeout}/>
          </Cell>
        </Grid>
        <hr/>
        <Grid>
          <Cell phone={12} col={3}>Public Key</Cell>
          <Cell phone={12} col={9}>
            <pre>{repository.get('key')}</pre>
          </Cell>
        </Grid>
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
}

export default connect(
  (state, ownProps) => ({
    repository: state.drone.repositories.find((repository) => { // find the correct repository by owner & name
      return (
        repository.get('owner') == ownProps.params.owner &&
        repository.get('name') == ownProps.params.name
      );
    })
  })
)(Content);
