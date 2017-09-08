import React, { Component } from "react";

export const drone = (client, Component) => {
	const component = class extends React.Component {
		getChildContext() {
			return {
				drone: client,
			};
		}

		render() {
			return <Component {...this.state} {...this.props} />;
		}
	};

	component.childContextTypes = {
		drone: (props, propName) => {
			return;
		},
	};

	return component;
};

export const inject = Component => {
	const component = class extends React.Component {
		constructor(props, context) {
			super(props, context);
		}

		render() {
			this.props.drone = this.context.drone;
			return <Component {...this.state} {...this.props} />;
		}
	};

	return component;
};
