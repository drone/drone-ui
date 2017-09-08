import React, { Component } from "react";
import TimeAgo from "react-timeago";

import Status from "shared/components/status";
import StatusNumber from "shared/components/status_number";
import BuildTime from "shared/components/build_time";
import BuildMeta from "shared/components/build_event";

import styles from "./list.less";

export const List = ({ children }) => (
	<div className={styles.list}>{children}</div>
);

export class Item extends Component {
	render() {
		const { build } = this.props;

		let eventDesc;
		let eventDest;

		switch (build.event) {
			case "push":
				eventDesc = "pushed to";
				eventDest = build.branch;
				break;
			case "pull_request":
				eventDesc = "updated pull request";
				eventDest = build.refspec != "" ? build.refspec : build.branch;
				break;
			case "tag":
				eventDesc = "pushed tag";
				eventDest = build.ref;
				break;
			case "deployment":
				eventDesc = "deployed to";
				eventDest = build.deploy_to;
				break;
		}

		return (
			<div className={styles.root}>
				<div className={styles.icon}>
					<img src={build.author_avatar} />
				</div>
				<div className={styles.body}>
					<h3>{build.message}</h3>

					<div className={styles.description} style={{ display: "none" }}>
						<em>{build.author}</em>
						<span>{eventDesc}</span>
						<em>{eventDest}</em>
					</div>
				</div>

				<div className={styles.meta}>
					<BuildMeta
						link={build.link_url}
						event={build.event}
						commit={build.commit}
						branch={build.branch}
					/>
				</div>

				<div className={styles.time}>
					<BuildTime
						start={build.started_at || build.created_at}
						finish={build.finished_at}
					/>
				</div>

				<div className={styles.status}>
					<StatusNumber status={build.status} number={build.number} />
					<Status status={build.status} />
				</div>
			</div>
		);
	}
}
