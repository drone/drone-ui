import React, { Component } from "react";
import styles from "./list.less";

export const List = ({ children }) => (
	<div className={styles.list}>{children}</div>
);

export const Item = props => (
	<div className={styles.item} key={props.name}>
		<div>
			{props.name}
			<ul>{props.event ? props.event.map(renderEvent) : null}</ul>
		</div>
		<div>
			<button onclick={props.ondelete}>delete</button>
		</div>
	</div>
);

const renderEvent = event => {
	return <li>{event}</li>;
};
