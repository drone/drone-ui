import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchRepo } from "../actions"

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { owner, name, dispatch } = this.props;
    if (owner && name) {
      dispatch(fetchRepo(owner, name));
    }
  }

  render() {
  	if (!this.props.repo) {
      return <div>Loading Repo {this.props.owner}/{this.props.name}</div>
  	}
    return (
      <div>
        <h1>Repo</h1>
        <div>
          {this.props.repo.full_name}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { owner, name } = state.router.params;
  console.log(state)
  return {
  	repo: state.repo,
    owner: owner,
    name: name,
  }
}

App.props = {
	repo: PropTypes.object,
	owner: PropTypes.string,
	name: PropTypes.string,
	dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(App)