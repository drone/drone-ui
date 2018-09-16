import React, { Component } from "react";

import { branch } from "baobab-react/higher-order";
import { inject } from "config/client/inject";

import {
	fetchRepository,
	updateRepository,
	repositorySlug,
} from "shared/utils/repository";

import {
	VISIBILITY_PUBLIC,
	VISIBILITY_PRIVATE,
	VISIBILITY_INTERNAL,
} from "shared/constants/visibility";

import styles from "./index.less";

const binding = (props, context) => {
	const { namespace, name } = props.match.params;
	const slug = repositorySlug(namespace, name);
	return {
		user: ["user", "data"],
		repo: ["repos", "data", slug],
	};
};

@inject
@branch(binding)
export default class Settings extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleTrustedChange = this.handleTrustedChange.bind(this);
		this.handleProtectedChange = this.handleProtectedChange.bind(this);
		this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
		this.handleTimeoutChange = this.handleTimeoutChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.repo !== nextProps.repo;
	}

	componentWillMount() {
		const { drone, dispatch, match, repo } = this.props;

		if (!repo) {
			dispatch(
				fetchRepository,
				drone,
				match.params.namespace,
				match.params.name,
			);
		}
	}

	render() {
		const { repo } = this.props;

		if (!repo) {
			return undefined;
		}

		return (
			<div className={styles.root}>
				<section>
					<h2>Project Settings</h2>
					<div>
						<label>
							<input
								type="checkbox"
								checked={repo.protected}
								onChange={this.handleProtectedChange}
							/>
							<span>Protected</span>
						</label>
						<label>
							<input
								type="checkbox"
								checked={repo.trusted}
								onChange={this.handleTrustedChange}
							/>
							<span>Trusted</span>
						</label>
					</div>
				</section>

				<section>
					<h2>Project Visibility</h2>
					<div>
						<label>
							<input
								type="radio"
								name="visibility"
								value="public"
								checked={repo.visibility === VISIBILITY_PUBLIC}
								onChange={this.handleVisibilityChange}
							/>
							<span>Public</span>
						</label>
						<label>
							<input
								type="radio"
								name="visibility"
								value="private"
								checked={repo.visibility === VISIBILITY_PRIVATE}
								onChange={this.handleVisibilityChange}
							/>
							<span>Private</span>
						</label>
						<label>
							<input
								type="radio"
								name="visibility"
								value="internal"
								checked={repo.visibility === VISIBILITY_INTERNAL}
								onChange={this.handleVisibilityChange}
							/>
							<span>Internal</span>
						</label>
					</div>
				</section>

				<section>
					<h2>Timeout</h2>
					<div>
						<input
							type="number"
							value={repo.timeout}
							onBlur={this.handleTimeoutChange}
						/>
						<span className={styles.minutes}>minutes</span>
					</div>
				</section>
			</div>
		);
	}

	handleTrustedChange(e) {
		this.handleChange("trusted", e.target.checked);
	}

	handleProtectedChange(e) {
		this.handleChange("protected", e.target.checked);
	}

	handleVisibilityChange(e) {
		this.handleChange("visibility", e.target.value);
	}

	handleTimeoutChange(e) {
		this.handleChange("timeout", parseInt(e.target.value));
	}

	handleChange(prop, value) {
		const { dispatch, drone, repo } = this.props;
		let data = {};
		data[prop] = value;
		dispatch(updateRepository, drone, repo.namespace, repo.name, data);
	}
}
