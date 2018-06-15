import React, { Component } from "react";
import { Link } from "react-router-dom";

import { LaunchIcon } from "shared/components/icons";
import { Switch } from "./switch";

import styles from "./list.less";

export const List = ({ children }) => (
	<div className={styles.list}>{children}</div>
);

export class Item extends Component {
	render() {
		const { namespace, name, active, link, onchange } = this.props;
		return (
			<div className={styles.item}>
				<div>
					{namespace}/{name}
				</div>
				<div className={active ? styles.active : styles.inactive}>
					<Link to={link}>
						<LaunchIcon />
					</Link>
				</div>
				<div>
					<Switch onchange={onchange} checked={active} />
				</div>
			</div>
		);
	}

	shouldComponentUpdate(nextProps) {
		return (
			this.props.namespace !== nextProps.namespace ||
			this.props.name !== nextProps.name ||
			this.props.active !== nextProps.active
		);
	}
}
