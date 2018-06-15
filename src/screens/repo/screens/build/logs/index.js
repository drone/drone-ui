import React, { Component } from "react";
import { inject } from "config/client/inject";
import { branch } from "baobab-react/higher-order";
import { repositorySlug } from "shared/utils/repository";
import { assertProcFinished, assertProcRunning } from "shared/utils/proc";
import { fetchLogs, subscribeToLogs, toggleLogs } from "shared/utils/logs";

import Term from "./components/term";

import { Top, Bottom, scrollToTop, scrollToBottom } from "./components/anchor";

import { ExpandIcon, PauseIcon, PlayIcon } from "shared/components/icons/index";

import styles from "./index.less";

const binding = (props, context) => {
	const { namespace, name, build } = props.match.params;
	const slug = repositorySlug(namespace, name);
	const number = parseInt(build);
	const stage = parseInt(props.match.params.stage || 1);
	const step = parseInt(props.match.params.step || 1);

	return {
		logs: ["logs", "data", slug, number, stage, step, "data"],
		eof: ["logs", "data", slug, number, stage, step, "eof"],
		loading: ["logs", "data", slug, number, stage, step, "loading"],
		error: ["logs", "data", slug, number, stage, step, "error"],
		follow: ["logs", "follow"],
	};
};

@inject
@branch(binding)
export default class Output extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleFollow = this.handleFollow.bind(this);
	}

	componentWillMount() {
		if (this.props.step) {
			this.componentWillUpdate(this.props);
		}
	}

	componentWillUpdate(nextProps) {
		const { loading, logs, eof, error } = nextProps;
		const routeChange = this.props.match.url !== nextProps.match.url;

		if (loading || error || (logs && eof)) {
			return;
		}

		if (assertProcFinished(nextProps.step)) {
			return this.props.dispatch(
				fetchLogs,
				nextProps.drone,
				nextProps.match.params.namespace,
				nextProps.match.params.name,
				nextProps.build.number,
				nextProps.stage.number,
				nextProps.step.number,
			);
		}

		if (assertProcRunning(nextProps.step) && (!logs || routeChange)) {
			this.props.dispatch(
				subscribeToLogs,
				nextProps.drone,
				nextProps.match.params.namespace,
				nextProps.match.params.name,
				nextProps.build.number,
				nextProps.stage.number,
				nextProps.step.number,
			);
		}
	}

	componentDidUpdate() {
		if (this.props.follow) {
			scrollToBottom();
		}
	}

	handleFollow() {
		this.props.dispatch(toggleLogs, !this.props.follow);
	}

	render() {
		const { logs, error, step, loading, follow } = this.props;

		if (loading || !step) {
			return <Term.Loading />;
		}

		if (error) {
			return <Term.Error />;
		}

		return (
			<div>
				<Top />
				<Term
					lines={logs || []}
					exitcode={assertProcFinished(step) ? step.exit_code : undefined}
				/>
				<Bottom />
				<Actions
					running={assertProcRunning(step)}
					following={follow}
					onfollow={this.handleFollow}
					onunfollow={this.handleFollow}
				/>
			</div>
		);
	}
}

/**
 * Component renders floating log actions. These can be used
 * to follow, unfollow, scroll to top and scroll to bottom.
 */
const Actions = ({ following, running, onfollow, onunfollow }) => (
	<div className={styles.actions}>
		{running && !following ? (
			<button onClick={onfollow} className={styles.follow}>
				<PlayIcon />
			</button>
		) : null}

		{running && following ? (
			<button onClick={onunfollow} className={styles.unfollow}>
				<PauseIcon />
			</button>
		) : null}

		<button onClick={scrollToTop} className={styles.bottom}>
			<ExpandIcon />
		</button>

		<button onClick={scrollToBottom} className={styles.top}>
			<ExpandIcon />
		</button>
	</div>
);
