import React, { Component } from "react";
import { CommitIcon, BranchIcon } from "shared/components/icons/index";
import styles from "./build_event.less";

export default class BuildEvent extends Component {
	render() {
		const { event, branch, commit, link } = this.props;
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
						<BranchIcon />
					</div>
					<div>{branch}</div>
				</div>
			</div>
		);
	}
}
