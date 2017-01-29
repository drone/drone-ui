import { branch } from 'baobab-react/higher-order';
import PageContent from '../../components/layout/content';
import React from 'react';
import { events, GET_REPO_SECRETS, DEL_REPO_SECRET, POST_REPO_SECRET } from '../../actions/events';
import { Textfield, FABButton, Icon, Switch } from 'react-mdl';

import './index.less';

class Content extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      addKey: '',
      addValue: ''
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdateSecret = this.handleUpdateSecret.bind(this);
  }

  componentDidMount() {
    const { owner, name } = this.props.params;
    events.emit(GET_REPO_SECRETS, { owner, name });
  }

  render() {

    const { owner, name } = this.props.params;
    const { secrets } = this.props;
    if (!secrets) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <PageContent className="repository-secrets">
        {
          secrets
            .map((secret, index) => {
            return (

              <div key={index}>
                <Textfield
                  label="Secret Name"
                  floatingLabel
                  style={{ width: '300px' }}
                  value={secret.name}
                  disabled={true}
                />
                <Textfield
                  label="Update Secret Value"
                  floatingLabel
                  style={{ width: '300px' }}
                  value={this.state[secret.name]}
                  onChange={(field) => this.handleSecretChange(secret.name, field.target.value)}
                />
                <FABButton ripple mini
                           onClick={this.handleDelete.bind(this, owner, name, secret.name)}
                >
                  <Icon name="delete"/>
                </FABButton>
                <FABButton ripple mini disabled={!this.state[secret.name]}
                           onClick={this.handleUpdateSecret.bind(this, owner, name, secret.name)}
                >
                  <Icon name="update"/>
                </FABButton>
                <Switch id="push" disabled={true} checked={ secret.event.indexOf('push') !== -1}>Push</Switch>
                <Switch id="tag" disabled={true} checked={ secret.event.indexOf('tag') !== -1}>Tag</Switch>
                <Switch id="deployment" disabled={true}
                        checked={ secret.event.indexOf('deployment') !== -1}>Deployment</Switch>
                <Switch id="pull_request" disabled={true} checked={ secret.event.indexOf('pull_request') !== -1}>Pull
                  request</Switch>
                <hr/>
              </div>
            );
          })
        }


        <Textfield
          label="Secret Name"
          floatingLabel
          style={{ width: '300px' }}
          onChange={(field) => this.handleAddKeyChange(field.target.value)}
          value={this.state.addKey}
        />
        <Textfield
          label="Secret Value"
          floatingLabel
          style={{ width: '300px' }}
          onChange={(field) => this.handleAddSecretChange(field.target.value)}
          value={this.state.addValue}
        />
        <FABButton ripple mini
                   onClick={this.handleAdd.bind(this, owner, name)}
        >
          <Icon name="add"/>
        </FABButton>
        <hr/>

      </PageContent>
    );
  }


  handleDelete(owner, name, secret) {
    events.emit(DEL_REPO_SECRET, { owner, name, secret });
  }

  handleUpdateSecret(owner, name, secretKey) {
    //TODO: need to handle skip_verify and what events
    let secret = {
      name: secretKey,
      value: this.state[secretKey],
      event: ['push', 'tag', 'deployment'],
      image:['*'],
      skip_verify: false
    };
    events.emit(POST_REPO_SECRET, { owner, name, secret });
  }

  handleAdd(owner, name) {
    //TODO: need to handle skip_verify and what events
    let secret = {
      name: this.state.addKey,
      value: this.state.addValue,
      event: ['push', 'tag', 'deployment'],
      image:['*'],
      skip_verify: false
    };
    events.emit(POST_REPO_SECRET, { owner, name, secret });
    this.setState({ addKey: '', addValue: '' });

  }

  handleAddKeyChange(addKey) {
    this.setState({ addKey });
  }

  handleAddSecretChange(addValue) {
    this.setState({ addValue });
  }

  handleSecretChange(secret_name, value) {
    this.setState({ [secret_name]: value });
  }
}

export default branch((props) => {
  const { owner, name } = props.params;
  return {
    secrets: ['secrets', owner, name]
  };
}, Content);
