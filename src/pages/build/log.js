import React from 'react';
import Request from 'superagent';
import { FABButton, Icon} from 'react-mdl';

import Term from '../../components/term';
import { RUNNING } from '../../components/status';

export default
class Log extends React.Component {
  constructor(props) {
    super(props);

    this.eventSource = null;

    this.state = {
      group: {},
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
    let terms = [];

    for (var prop in this.state.groups) {
      terms.push(
        <Term key={prop} name={prop}
          lines={this.state.groups[prop].lines}></Term>
      );
    }

    return (
      <div>
        {job.get('status') == RUNNING ?
          <FABButton mini onClick={this.handleFollow}>
            <Icon name={this.state.follow ? 'pause' : 'expand_more'}/>
          </FABButton> :
          null}
        <div>{terms}</div>
      </div>
    );
  }

  requestLog(owner, name, build, job) {
    Request.get(`/api/repos/${owner}/${name}/logs/${build.get('number')}/${job.get('number')}`)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        var groups = {};
        var lines = JSON.parse(response.text);
        lines.map(function(line, i) {
          if (!line.proc) {
            return;
          }
          var group = groups[line.proc]
          if (!group) {
            group = {
              name: line.proc,
              lines: [],
            };
            groups[line.proc] = group;
          }
          group.lines.push(line);
        });

        this.setState({
          groups: groups
        });
      });
  }

  requestStream(owner, name, build, job) {
    this.eventSource = new EventSource(
      `/api/stream/${owner}/${name}/${build.get('number')}/${job.get('number')}`,
      {withCredentials: true}
    );

    this.eventSource.onmessage = (event) => {
      var line = JSON.parse(event.data);
      var groups = this.state.groups;
      var group = this.state.groups[line.proc]
      if (!group) {
        group = {
          name: line.proc,
          lines: [],
        };
        groups[line.proc] = group;
      }
      group.lines.push(line);
      this.setState({
        groups: groups
      });

      this.scrollToPageBottom();
    };

    this.eventSource.onerror = () => {
      this.eventSource.close();
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
    if (this.state.follow) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
}
