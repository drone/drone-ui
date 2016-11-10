import {branch} from 'baobab-react/higher-order';
import Humanize from './humanize';
import React from 'react';
import TimeAgo from 'react-timeago';
import {
  events,
  ADD_CUSTOM_PARAM,
  REMOVE_CUSTOM_PARAM,
  UPDATE_CUSTOM_PARAM,
  CLEAR_CUSTOM_PARAMS
} from '../actions/events';
import {IconButton, Button, Textfield} from 'react-mdl';

import './build_panel.less';

export class BuildPanel extends React.Component {
  constructor(props) {
    super(props);

    this.addInputField = this.addInputField.bind(this);

    const {environment} = this.props.job;
    Object.keys(environment).forEach(key => {
      let val = environment[key];
      if (val) { // only present params with value
        events.emit(ADD_CUSTOM_PARAM, {value: key + '=' + val});
      }
    });
  }

  componentWillUnmount() {
    events.emit(CLEAR_CUSTOM_PARAMS);
  }

  addInputField() {
    events.emit(ADD_CUSTOM_PARAM, {value: ''});
  }

  removeInputField(index) {
    events.emit(REMOVE_CUSTOM_PARAM, index);
  }

  handleInputFieldChange(index, event) {
    events.emit(UPDATE_CUSTOM_PARAM, {index: index, value: event.target.value});
  }

  renderInputs() {
    const {customParams} = this.props;

    if (customParams) {
      return customParams.reduce((environs, p, i) => {
        let textFieldClasses = ['custom-param', p.removed ? 'hidden' : ''].join(' ');
        let removeBtnClasses = ['remove-param', p.removed ? 'hidden' : ''].join(' ');

        environs.push(
          <div key={'cp' + i}>
            <Textfield
              key={'input' + i}
              className={textFieldClasses}
              label='PARAM=value...'
              value={p.value}
              onChange={this.handleInputFieldChange.bind(this, i)}/>
            <IconButton
              name='clear'
              key={'delete' + i}
              className={removeBtnClasses}
              onClick={this.removeInputField.bind(this, i)}/>
          </div>);
        return environs;
      }, []);
    }
  }

  render() {
    const {build, job} = this.props;

    let classes = ['build-panel', job.status];

    return (
      <div className={classes.join(' ')}>
        <div className="build-panel-detail">
          <div>
            <div><em>Branch:</em> {build.branch}</div>
            <div>
              <em>Commit:</em> {build.commit.substr(0,8)}
              <a href={build.link_url} target="_blank" className="commit-link">
                <i className="material-icons">insert_link</i>
              </a>
            </div>
            <div><em>Author:</em> {build.author}</div>
            <div className="input-group">
              {this.renderInputs()}
              <Button ripple onClick={this.addInputField} className="add-param">Add new param</Button>
            </div>
            <p>{build.message}</p>
          </div>
          <div>
            <div>
              <i className="material-icons">access_time</i>
              {job.started_at ?
                <TimeAgo date={(job.started_at || build.created_at) * 1000} /> :
                <span>--</span>
              }
            </div>
            <div>
              <i className="material-icons">timelapse</i>
              {job.finished_at ?
                <Humanize finished={job.finished_at} start={job.started_at} /> :
                <TimeAgo date={(job.started_at || build.created_at) * 1000} />
              }
            </div>
          </div>
        </div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

export default branch({
  customParams: ['pages', 'build', 'custom_params']
}, BuildPanel);

/**/
