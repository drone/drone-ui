import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

import Status from "shared/components/status";
import { Elapsed, formatTime } from "./elapsed";

import styles from "./procs.less";

const renderEnviron = data => {
	return ( <div>{data[0]}={data[1]}</div> );
};

const ProcListHolder = ({ vars, children }) => (
	<div className={styles.list}>
		{ vars.environ ? <div className={styles.vars}>{Object.entries(vars.environ).map(renderEnviron)}</div>: null }
		{children}
	</div>
);

export class ProcList extends Component {
	render() {
		const { repo, build, rootProc, selectedProc } = this.props;
		return (
			<ProcListHolder vars={rootProc}>
			{
				this.props.rootProc.children.map(function(child) {
					return(
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
								selected={child.pid === selectedProc.pid}
							/>
						</Link>
					)}
				)
			}
			</ProcListHolder>
		);

	}
};

export const ProcListItem = ({ name, start, finish, state, selected }) => (
	<div className={classnames(styles.item, selected ? styles.selected : null)}>
		<h3>{name}</h3>
		{finish ? (
			<time>{formatTime(finish, start)}</time>
		) : (
			<Elapsed start={start} />
		)}
		<div>
			<Status status={state} />
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
