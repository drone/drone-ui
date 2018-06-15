import React, { Component } from "react";

import BuildMeta from "shared/components/build_event";
import BuildTime from "shared/components/build_time";
import { StatusLabel } from "shared/components/status";

import styles from "./details.less";

export class Details extends Component {
	render() {
		const { build } = this.props;

		return (
			<div className={styles.info}>
				<StatusLabel status={build.status} />

				<section className={styles.message}>{build.message}</section>

				<section>
					<BuildTime
						start={build.started || build.created}
						finish={build.finished}
					/>
				</section>

				<section>
					<BuildMeta
						link={build.link}
						event={build.event}
						after={build.after}
						target={build.target}
						deployTo={build.deploy_to}
						refspec={build.refspec}
						refs={build.ref}
					/>
				</section>
			</div>
		);
	}
}
