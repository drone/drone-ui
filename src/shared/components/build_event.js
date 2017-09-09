import React, { Component } from "react";
import {
	BranchIcon,
	CommitIcon,
	DeployIcon,
	LaunchIcon,
	MergeIcon,
	TagIcon,
} from "shared/components/icons/index";
import styles from "./build_event.less";

export default class BuildEvent extends Component {
	render() {
		const { event, branch, commit, refs, refspec, link, target } = this.props;

		return (
			<div className={styles.host}>
				<div className={styles.row}>
					<div>
						<CommitIcon />
					</div>
					<div>{commit && commit.substr(0, 10)}</div>
				</div>
				<div className={styles.row}>
					<div>
						{event === "tag" ? (
							<TagIcon />
						) : event === "pull_request" ? (
							<MergeIcon />
						) : event === "deployment" ? (
							<DeployIcon />
						) : (
							<BranchIcon />
						)}
					</div>
					<div>
						{event === "tag" && refs ? (
							trimTagRef(refs)
						) : event === "pull_request" && refspec ? (
							trimMergeRef(refs)
						) : event === "deployment" && target ? (
							target
						) : (
							branch
						)}
					</div>
				</div>
				<a href={link} target="_blank">
					<LaunchIcon />
				</a>
			</div>
		);
	}
}

const trimMergeRef = ref => {
	return ref.match(/\d/g) || ref;
};

const trimTagRef = ref => {
	return ref.startsWith("refs/tags/") ? ref.substr(10) : ref;
};

// push
// pull request (ref)
// tag (ref)
// deploy
