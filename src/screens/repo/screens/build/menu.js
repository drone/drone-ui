import React, { Component } from "react";
import RepoMenu from "../builds/menu";
import { RefreshIcon, CloseIcon, DeployIcon } from "shared/components/icons";

import {
	cancelBuild,
	restartBuild,
	promoteBuild,
	assertBuildMatrix,
} from "shared/utils/build";
import { findChildProcess } from "shared/utils/proc";
import { repositorySlug } from "shared/utils/repository";

import { branch } from "baobab-react/higher-order";
import { inject } from "config/client/inject";
import PlayIcon from "shared/components/icons/play";
import { STATUS_SUCCESS } from "shared/constants/status";

const binding = (props, context) => {
	const { owner, repo, build } = props.match.params;
	const slug = repositorySlug(owner, repo);
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
		this.handlePromote = this.handlePromote.bind(this);
		this.togglePromote = this.togglePromote.bind(this);
	}

	getInitialState() {
		return {
			togglePromote: false,
			customEnv: "",
		};
	}

	handleRestart() {
		const { dispatch, drone, repo, build } = this.props;
		dispatch(restartBuild, drone, repo.owner, repo.name, build.number);
	}

	handlePromote(env) {
		const { dispatch, drone, repo, build } = this.props;
		dispatch(promoteBuild, drone, repo.owner, repo.name, build.number, env);
	}

	togglePromote() {
		var state = this.state;
		state.togglePromote = !this.state.togglePromote;
		this.setState(state);
	}

	updateCustomEnv(evt) {
		var state = this.state;
		state.customEnv = evt.target.value;
		this.setState(state);
	}

	handleCancel() {
		const { dispatch, drone, repo, build, match } = this.props;
		const proc = findChildProcess(build.procs, match.params.proc || 2);

		dispatch(
			cancelBuild,
			drone,
			repo.owner,
			repo.name,
			build.number,
			proc.ppid,
		);
	}

	render() {
		const { build, match } = this.props;
		const { proc } = match.params;

		const hideCancel = assertBuildMatrix(build) && !proc;
		var handlePromote = this.handlePromote;
		var envs = [];
		if (build !== undefined && build.deploy_envs !== undefined) {
			envs = build.deploy_envs.map(function(env) {
				return env.name;
			});
		}

		return (
			<div>
				{!build ? (
					undefined
				) : (
					<section>
						<ul>
							<li>
								{build.status === "peding" ||
								build.status === "running" ? !hideCancel ? (
									<button onClick={this.handleCancel}>
										<CloseIcon />
										<span>Cancel</span>
									</button>
								) : null : (
									<button onClick={this.handleRestart}>
										<RefreshIcon />
										<span>Restart Build</span>
									</button>
								)}
							</li>
							<li>
								{build.status === STATUS_SUCCESS ? (
									<button onClick={this.togglePromote}>
										<DeployIcon />
										<span>Promote Build</span>
									</button>
								) : null}
								{build.status === STATUS_SUCCESS && this.state.togglePromote ? (
									<ul className="sub">
										{envs.map(function(env, i) {
											return (
												<li key={i}>
													<button onClick={handlePromote.bind(this, env)}>
														<PlayIcon />
														<span>{env}</span>
													</button>
												</li>
											);
										})}
										<li>
											<button
												onClick={handlePromote.bind(this, this.state.customEnv)}
											>
												<PlayIcon />
												<input
													type="text"
													value={this.state.customEnv}
													onClick={event => event.stopPropagation()}
													onChange={this.updateCustomEnv.bind(this)}
													placeholder="Deployment target (eg: test)"
												/>
											</button>
										</li>
									</ul>
								) : null}
							</li>
						</ul>
					</section>
				)}
				<RepoMenu {...this.props} />
			</div>
		);
	}
}
