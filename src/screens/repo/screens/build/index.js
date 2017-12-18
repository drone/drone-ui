import React, { Component } from "react";
import { Link } from "react-router-dom";

import {
	approveBuild,
	assertBuildMatrix,
	cancelBuild,
	declineBuild,
	fetchBuild,
	restartBuild,
} from "shared/utils/build";
import {
	STATUS_BLOCKED,
	STATUS_DECLINED,
	STATUS_ERROR,
} from "shared/constants/status";

import { findChildProcess } from "shared/utils/proc";
import { fetchRepository } from "shared/utils/repository";

import Breadcrumb, { SEPARATOR } from "shared/components/breadcrumb";

import {
	Approval,
	Details,
	MatrixList,
	MatrixItem,
	ProcList,
	ProcListItem,
} from "./components";

import { branch } from "baobab-react/higher-order";
import { inject } from "config/client/inject";

import Output from "./logs";

import styles from "./index.less";

const binding = (props, context) => {
	const { owner, repo, build } = props.match.params;
	const slug = `${owner}/${repo}`;
	const number = parseInt(build);

	return {
		repo: ["repos", "data", slug],
		build: ["builds", "data", slug, number],
	};
};

@inject
@branch(binding)
export default class BuildLogs extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleApprove = this.handleApprove.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleDecline = this.handleDecline.bind(this);
		this.handleRestart = this.handleRestart.bind(this);
	}

	componentWillMount() {
		this.synchronize(this.props);
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

	handleRestart() {
		const { dispatch, drone, repo, build } = this.props;
		dispatch(restartBuild, drone, repo.owner, repo.name, build.number);
	}

	handleApprove() {
		const { repo, build, drone } = this.props;
		this.props.dispatch(
			approveBuild,
			drone,
			repo.owner,
			repo.name,
			build.number,
		);
	}

	handleDecline() {
		const { repo, build, drone } = this.props;
		this.props.dispatch(
			declineBuild,
			drone,
			repo.owner,
			repo.name,
			build.number,
		);
	}

	componentWillUpdate(nextProps) {
		if (this.props.match.url !== nextProps.match.url) {
			this.synchronize(nextProps);
		}
	}

	synchronize(props) {
		if (!props.repo) {
			this.props.dispatch(
				fetchRepository,
				props.drone,
				props.match.params.owner,
				props.match.params.repo,
			);
		}
		if (!props.build || !props.build.procs) {
			this.props.dispatch(
				fetchBuild,
				props.drone,
				props.match.params.owner,
				props.match.params.repo,
				props.match.params.build,
			);
		}
	}

	render() {
		const { repo, build } = this.props;

		if (!build || !repo) {
			return this.renderLoading();
		}

		if (build.status === STATUS_DECLINED || build.status === STATUS_ERROR) {
			return this.renderError();
		}

		if (build.status === STATUS_BLOCKED) {
			return this.renderBlocked();
		}

		if (!build.procs) {
			return this.renderLoading();
		}

		if (assertBuildMatrix(build)) {
			return this.renderMatrix();
		}

		return this.renderSimple();
	}

	renderLoading() {
		return (
			<div className={styles.host}>
				<div className={styles.columns}>
					<div className={styles.right}>Loading ...</div>
				</div>
			</div>
		);
	}

	renderBlocked() {
		const { build } = this.props;
		return (
			<div className={styles.host}>
				<div className={styles.columns}>
					<div className={styles.right}>
						<Details build={build} />
					</div>
					<div className={styles.left}>
						<Approval
							onapprove={this.handleApprove}
							ondecline={this.handleDecline}
						/>
					</div>
				</div>
			</div>
		);
	}

	renderError() {
		const { build } = this.props;
		return (
			<div className={styles.host}>
				<div className={styles.columns}>
					<div className={styles.right}>
						<Details build={build} />
					</div>
					<div className={styles.left}>
						<div className={styles.logerror}>
							{build.status === STATUS_ERROR ? (
								build.error
							) : (
								"Pipeline execution was declined"
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderSimple() {
		const { repo, build, match } = this.props;
		const proc = findChildProcess(build.procs || [], match.params.proc || 2);
		const parent = findChildProcess(build.procs, proc.ppid);

		let data = Object.assign({}, build);
		if (assertBuildMatrix(data)) {
			data.started_at = parent.start_time;
			data.finish_at = parent.finish_time;
			data.status = parent.state;
		}

		return (
			<div className={styles.host}>
				<div className={styles.columns}>
					<div className={styles.right}>
						<Details
							build={data}
							match={match}
							cancelHandler={this.handleCancel}
							restartHandler={this.handleRestart}
						/>
						<section className={styles.sticky}>
							<ProcList>
								{parent.children.map(function(child) {
									return (
										<Link
											to={`/${repo.full_name}/${build.number}/${child.pid}`}
											key={`${repo.full_name}-${build.number}-${child.pid}`}
										>
											<ProcListItem
												key={child.pid}
												name={child.name}
												start={child.start_time}
												finish={child.end_time}
												state={child.state}
												selected={child.pid === proc.pid}
											/>
										</Link>
									);
								})}
							</ProcList>
						</section>
					</div>
					<div className={styles.left}>
						{proc && proc.error ? (
							<div className={styles.logerror}>{proc.error}</div>
						) : null}
						{parent && parent.error ? (
							<div className={styles.logerror}>{parent.error}</div>
						) : null}
						<Output
							match={this.props.match}
							build={this.props.build}
							parent={parent}
							proc={proc}
						/>
					</div>
				</div>
			</div>
		);
	}

	renderMatrix() {
		const { repo, build, match } = this.props;

		if (match.params.proc) {
			return this.renderSimple();
		}

		return (
			<div className={styles.host}>
				<div className={styles.columns}>
					<div className={styles.right}>
						<Details build={build} />
					</div>
					<div className={styles.left}>
						<MatrixList>
							{build.procs.map(child => {
								return (
									<Link
										to={`/${repo.full_name}/${build.number}/${child.children[0]
											.pid}`}
										key={`${repo.full_name}-${build.number}-${child.children[0]
											.pid}`}
									>
										<MatrixItem
											number={child.pid}
											start={child.start_time}
											finish={child.end_time}
											status={child.state}
											environ={child.environ}
										/>
									</Link>
								);
							})}
						</MatrixList>
					</div>
				</div>
			</div>
		);
	}
}

export class BuildLogsTitle extends Component {
	render() {
		const { owner, repo, build } = this.props.match.params;
		return (
			<Breadcrumb
				elements={[
					<Link to={`/${owner}/${repo}`} key={`${owner}-${repo}`}>
						{owner} / {repo}
					</Link>,
					SEPARATOR,
					<Link
						to={`/${owner}/${repo}/${build}`}
						key={`${owner}-${repo}-${build}`}
					>
						{build}
					</Link>,
				]}
			/>
		);
	}
}
