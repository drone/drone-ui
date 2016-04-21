import React from 'react';
import Request from 'superagent';
import { FABButton, Icon} from 'react-mdl';

import { RUNNING } from '../../components/status';

export default
class Log extends React.Component {
  constructor(props) {
    super(props);

    this.eventSource = null;

    this.state = {
      text: '',
      follow: false
    };

    this.handleFollow = this.handleFollow.bind(this);
  }

  componentDidMount() {
    const {owner, name, build, job} = this.props;

    if (job.get('status') == RUNNING) {
      this.requestStream(owner, name, build, job);
    } else {
      this.requestLog(owner, name, build, job);
    }
  }

  componentWillUnmount() {
    if (this.eventSource != null) {
      console.log('Closing the eventSource');
      this.eventSource.close();
    }
  }

  render() {
    const { job } = this.props;

    return (
      <div>
        {job.get('status') == RUNNING ?
          <FABButton mini onClick={this.handleFollow}>
            <Icon name={this.state.follow ? 'pause' : 'expand_more'}/>
          </FABButton> :
          null}
        <div>{this.state.text}</div>
      </div>
    );
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
    this.eventSource = new EventSource(
      `/api/stream/${owner}/${name}/${build.get('number')}/${job.get('number')}`,
      {withCredentials: true}
    );

    this.eventSource.onmessage = (event) => {
      this.setState({
        text: this.state.text + event.data
      });

      this.scrollToPageBottom();
    };

    this.eventSource.onerror = (event) => {
      console.log('user event stream closed due to error.', event); // TODO: Create UI feedback for error
    };
  }

  handleFollow() {
    this.setState({
      follow: !this.state.follow
    }, () => {
      this.scrollToPageBottom();
    });
  }

  scrollToPageBottom() {
    console.log(this.state.follow);
    if (this.state.follow) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
}
