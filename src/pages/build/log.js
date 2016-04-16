import React from 'react';
import Request from 'superagent';

import { RUNNING } from '../../components/status';

export default
class Log extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };
  }

  componentDidMount() {
    const {owner, name, build, job} = this.props;

    if (job.get('status') == RUNNING) {
      this.requestStream(owner, name, build, job);
    } else {
      this.requestLog(owner, name, build, job);
    }
  }

  requestLog(owner, name, build, job) {
    Request.get(`/api/repos/${owner}/${name}/logs/${build.get('number')}/${job.get('number')}`)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        this.setState({
          text: response.text
        });
      });
  }

  requestStream(owner, name, build, job) {
    const events = new EventSource(
      `/api/stream/${owner}/${name}/${build.get('number')}/${job.get('number')}`,
      {withCredentials: true}
    );

    events.onmessage = (event) => {
      this.setState({
        text: this.state.text + event.data
      });
    };

    events.onerror = (event) => {
      console.log('user event stream closed due to error.', event); // TODO: Create UI feedback for error
    };
  }

  render() {
    return (
      <div>{this.state.text}</div>
    );
  }
}
