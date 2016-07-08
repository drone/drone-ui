import React from 'react';
import Request from 'superagent';
import { FABButton, Icon} from 'react-mdl';

import Term from '../../components/term';
import { RUNNING } from '../../components/status';

export default
class Log extends React.Component {
  constructor(props) {
    super(props);

    this.ws = null;

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
    if (this.ws != null) {
      console.log('Closing the websocket');
      this.ws.close();
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
        lines.map(function(line) {
          if (!line.proc) {
            return;
          }
          var group = groups[line.proc];
          if (!group) {
            group = {
              name: line.proc,
              lines: []
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
    this.ws = this.createWebSocket(owner, name, build.get('number'), job.get('number'));
    this.setState({
      groups: {}
    });

    this.ws.onmessage = (event) => {
      var line = JSON.parse(event.data);
      var groups = this.state.groups;
      var group = this.state.groups[line.proc];
      if (!group) {
        group = {
          name: line.proc,
          lines: []
        };
        groups[line.proc] = group;
      }
      group.lines.push(line);
      this.setState({
        groups: groups
      });

      this.scrollToPageBottom();
    };

    this.ws.onerror = () => {
      this.ws.close();
    };
  }

  createWebSocket(owner, name, build, job) {
    let proto = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
    let path = `/ws/logs/${owner}/${name}/${build}/${job}`;
    return new WebSocket(proto + '//' + window.location.host + path);
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
      // TODO this assumes mdl-layout__content exists as the parent. While this
      // is true it feels like it breaks the spirit of individual components
      // having a specific parental dependency. Revisit this.
      document.querySelector('.mdl-layout__content').scrollTo(0,
        document.querySelector('.mdl-layout__content').scrollHeight);
    }
  }
}
