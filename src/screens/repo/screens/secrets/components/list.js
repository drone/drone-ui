import React from "react";
import styles from "./list.less";

export const List = ({ children }) => <div>{children}</div>;

export const Item = props => (
	<div className={styles.item} key={props.name}>
		<div>
			{props.name}
			<ul>{props.policy ? Object.keys(props.policy).map(key => renderDirective(key, props.policy[key])) : null}</ul>
		</div>
		<div>
			<button onClick={props.ondelete}>delete</button>
		</div>
	</div>
);

const renderDirective = (name, directive) => {
	if (directive.none) {
		return <li>{name}<span>none</span></li>;		
	}
	return <li>{name}<span>{directive.match.join(", ")}</span></li>;
};
