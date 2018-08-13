import React, { Component } from "react";
import { Link } from "react-router-dom";

import {
	fetchBuild,
	approveBuild,
	declineBuild,
	assertBuildMatrix,
} from "shared/utils/build";
import {
	STATUS_BLOCKED,
	STATUS_DECLINED,
	STATUS_ERROR,
} from "shared/constants/status";

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
	const { namespace, name, build } = props.match.params;
	const slug = `${namespace}/${name}`;
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
		this.handleDecline = this.handleDecline.bind(this);
	}

	componentWillMount() {
		this.synchronize(this.props);
	}

	handleApprove() {
		const { repo, build, drone } = this.props;
		this.props.dispatch(
			approveBuild,
			drone,
			repo.namespace,
			repo.name,
			build.number,
		);
	}

	handleDecline() {
		const { repo, build, drone } = this.props;
		this.props.dispatch(
			declineBuild,
			drone,
			repo.namespace,
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
				props.match.params.namespace,
				props.match.params.name,
			);
		}
		if (!props.build || !props.build.stages) {
			this.props.dispatch(
				fetchBuild,
				props.drone,
				props.match.params.namespace,
				props.match.params.name,
				props.match.params.build,
			);
		}
	}

	render() {
		const { repo, build } = this.props;

		if (!build || !repo) {
			return this.renderLoading();
		}

		if (build.status === STATUS_DECLINED) {
			return this.renderError();
		}

		if (build.status === STATUS_ERROR && !build.stages) {
			return this.renderError();
		}

		if (build.status === STATUS_BLOCKED) {
			return this.renderBlocked();
		}

		if (!build.stages) {
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
		const parent =
			build &&
			build.stages &&
			build.stages[parseInt(match.params.stage) - 1 || 0];
		const step =
			parent &&
			parent.steps &&
			parent.steps[parseInt(match.params.step) - 1 || 0];

		let data = Object.assign({}, build);
		if (assertBuildMatrix(data)) {
			data.started = parent.started;
			data.finished = parent.finished;
			data.status = parent.status;
		}

		return (
			<div className={styles.host}>
				<div className={styles.columns}>
					<div className={styles.right}>
						<Details build={data} />
						<section className={styles.sticky}>
							<ProcList>
								{parent &&
									parent.steps &&
									parent.steps.map(function(child) {
										return (
											<Link
												to={`/${repo.slug}/${build.number}/${parent.number}/${child.number}`}
												key={`${repo.slug}-${build.number}-${parent.number}-${child.number}`}
											>
												<ProcListItem
													key={child.id}
													name={child.name}
													started={child.started}
													stopped={child.stopped}
													status={child.status}
													selected={step && child.number === step.number}
												/>
											</Link>
										);
									})}
							</ProcList>
						</section>
					</div>
					<div className={styles.left}>
						{step && step.error ? (
							<div className={styles.logerror}>{step.error}</div>
						) : null}
						{parent && parent.error ? (
							<div className={styles.logerror}>{parent.error}</div>
						) : null}
						<Output
							match={this.props.match}
							build={this.props.build}
							stage={parent}
							step={step}
						/>
					</div>
				</div>
			</div>
		);
	}

	renderMatrix() {
		const { repo, build, match } = this.props;

		if (match.params.step) {
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
							{build.stages.map(child => {
								return (
									<Link
										to={`/${repo.slug}/${build.number}/${child.number}/1`}
										key={`${repo.slug}-${build.number}-${child.number}`}
									>
										<MatrixItem
											name={child.name}
											number={child.number}
											start={child.started}
											finish={child.stopped}
											status={child.status}
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
		const { namespace, name, build } = this.props.match.params;
		return (
			<Breadcrumb
				elements={[
					<Link to={`/${namespace}/${name}`} key={`${namespace}-${name}`}>
						{namespace} / {name}
					</Link>,
					SEPARATOR,
					<Link
						to={`/${namespace}/${name}/${build}`}
						key={`${namespace}-${name}-${build}`}
					>
						{build}
					</Link>,
				]}
			/>
		);
	}
}
