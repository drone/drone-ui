import React, { Component } from "react";
import RepoMenu from "../builds/menu";
import { RefreshIcon, CloseIcon } from "shared/components/icons";

import {
	cancelBuild,
	restartBuild,
	assertBuildMatrix,
} from "shared/utils/build";
import { findChildProcess } from "shared/utils/proc";
import { repositorySlug } from "shared/utils/repository";

import { branch } from "baobab-react/higher-order";
import { inject } from "config/client/inject";

const binding = (props, context) => {
	const { namespace, name, build } = props.match.params;
	const slug = repositorySlug(namespace, name);
	const number = parseInt(build);
	return {
		repo: ["repos", "data", slug],
		build: ["builds", "data", slug, number],
	};
};

@inject
@branch(binding)
export default class BuildMenu extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleCancel = this.handleCancel.bind(this);
		this.handleRestart = this.handleRestart.bind(this);
	}

	handleRestart() {
		const { dispatch, drone, repo, build } = this.props;
		dispatch(restartBuild, drone, repo.namespace, repo.name, build.number);
	}

	handleCancel() {
		const { dispatch, drone, repo, build } = this.props;

		dispatch(
			cancelBuild,
			drone,
			repo.namespace,
			repo.name,
			build.number,
		);
	}

	render() {
		const { build, match } = this.props;
		const { stage } = match.params;

		return (
			<div>
				{!build ? (
					undefined
				) : (
					<section>
						<ul>
							<li>
								{build.status === "pending" ||
								build.status === "planned" ||
								build.status === "running" ? (
									<button onClick={this.handleCancel}>
										<CloseIcon />
										<span>Cancel</span>
									</button>
								) : (
									<button onClick={this.handleRestart}>
										<RefreshIcon />
										<span>Restart Build</span>
									</button>
								)}
							</li>
						</ul>
					</section>
				)}
				<RepoMenu {...this.props} />
			</div>
		);
	}
}
