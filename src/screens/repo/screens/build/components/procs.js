import React from "react";
import classnames from "classnames";

import Status from "shared/components/status";
import { Elapsed, formatTime } from "./elapsed";

import styles from "./procs.less";

export const ProcList = ({ children }) => (
	<div className={styles.list}>{children}</div>
);

export const ProcListItem = ({ name, started, stopped, status, selected }) => (
	<div className={classnames(styles.item, selected ? styles.selected : null)}>
		<h3>{name}</h3>
		{stopped ? (
			<time>{formatTime(stopped, started)}</time>
		) : (
			<Elapsed start={started} />
		)}
		<div>
			<Status status={status} />
		</div>
	</div>
);

// function List({ children }) {
// 	return <div className={styles.list}>{children}</div>;
// }
//
// function ListItem({ name, start, finish, state, selected }) {
// 	const classes = classnames(styles.item, selected ? styles.selected : null);
// 	return (
// 		<div className={classes}>
// 			<h3>{name}</h3>
//
// 			{finish ? (
// 				<time>{formatTime(finish, start)}</time>
// 			) : (
// 				<Timer start={start} />
// 			)}
//
// 			<div>
// 				<Status status={state} />
// 			</div>
// 		</div>
// 	);
// }
