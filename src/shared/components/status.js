import React, { Component } from "react";
import classnames from "classnames";
import style from "./status.less";

import {
	CheckIcon,
	CloseIcon,
	ClockIcon,
	RefreshIcon,
	RemoveIcon,
} from "./icons/index";

const defaultIconSize = 15;

const messages = {
	success: "Successful",
	failure: "Failure",
	running: "Running",
	started: "Running",
	pending: "Pending",
	skipped: "Skipped",
	blocked: "Pending Approval",
	declined: "Declined",
	killed: "Cancelled",
	error: "Error",
};

export default class Status extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return this.props.status !== nextProps.status;
	}

	render() {
		const { status } = this.props;
		const icon = renderIcon(status, defaultIconSize);
		const classes = classnames(style.root, style[status]);
		return <div className={classes}>{icon}</div>;
	}
}

const renderIcon = (status, size) => {
	switch (status) {
		case "skipped":
			return <RemoveIcon size={size} />;
		case "pending":
			return <ClockIcon size={size} />;
		case "running":
		case "started":
			return <RefreshIcon size={size} />;
		case "success":
			return <CheckIcon size={size} />;
		default:
			return <CloseIcon size={size} />;
	}
};

export const StatusLabel = ({ status }) => (
	<div className={classnames(style.label, style[status])}>
		<div>{messages[status]}</div>
	</div>
);
