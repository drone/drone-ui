import React, { Component } from "react";
import classnames from "classnames";
import {
	STATUS_BLOCKED,
	STATUS_DECLINED,
	STATUS_ERROR,
	STATUS_FAILURE,
	STATUS_KILLED,
	STATUS_PENDING,
	STATUS_RUNNING,
	STATUS_SKIPPED,
	STATUS_SUCCESS,
	STATUS_STARTED
} from "shared/constants/status";
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
	STATUS_BLOCKED: "Pending Approval",
	STATUS_DECLINED: "Declined",
	STATUS_ERROR: "Error",
	STATUS_FAILURE: "Failure",
	STATUS_KILLED: "Cancelled",
	STATUS_PENDING: "Pending",
	STATUS_RUNNING: "Running",
	STATUS_SKIPPED: "Skipped",
	STATUS_STARTED: "Running",
	STATUS_SUCCESS: "Successful",
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
		case STATUS_SKIPPED:
			return <RemoveIcon size={size} />;
		case STATUS_PENDING:
			return <ClockIcon size={size} />;
		case STATUS_RUNNING:
		case STATUS_STARTED:
			return <RefreshIcon size={size} />;
		case STATUS_SUCCESS:
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
