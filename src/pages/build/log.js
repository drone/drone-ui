import React from 'react';
import Request from 'superagent';

export default
class Log extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: null
    };
  }

  componentDidMount() {
    const {owner, name, build, job} = this.props;

    Request.get(`/api/repos/${owner}/${name}/logs/${build}/${job}`)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        this.setState({
          text: response.text
        });
      });
  }

  render() {
    return (
      <div>{this.state.text}</div>
    );
  }
}
