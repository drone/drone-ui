import React, { Component } from "react";

import BuildMeta from "shared/components/build_event";
import BuildTime from "shared/components/build_time";
import { RefreshIcon, CloseIcon } from "shared/components/icons";
import { StatusLabel } from "shared/components/status";
import { STATUS_PENDING, STATUS_RUNNING } from "shared/constants/status";
import { assertBuildMatrix } from "shared/utils/build";

import styles from "./details.less";

export class Details extends Component {
	render() {
		const { build, match } = this.props;

		const inProgress =
			build.status === STATUS_PENDING || build.status === STATUS_RUNNING;
		const hideCancel = assertBuildMatrix(build) && !match.params.proc;
		const showCancelButton = inProgress && !hideCancel;
		const showRestartButton = !inProgress;

		return (
			<div className={styles.info}>
				<StatusLabel status={build.status} />

				<section className={styles.message}>{build.message}</section>

				<section className={styles.actions}>
					{showCancelButton && (
						<button onClick={this.props.cancelHandler}>
							<CloseIcon />
							<span>Cancel</span>
						</button>
					)}
					{showRestartButton && (
						<button onClick={this.props.restartHandler}>
							<RefreshIcon />
							<span>Restart Build</span>
						</button>
					)}
				</section>

				<section>
					<BuildTime
						start={build.started_at || build.created_at}
						finish={build.finished_at}
					/>
				</section>

				<section>
					<BuildMeta
						link={build.link_url}
						event={build.event}
						commit={build.commit}
						branch={build.branch}
						target={build.deploy_to}
						refspec={build.refspec}
						refs={build.ref}
					/>
				</section>
			</div>
		);
	}
}
