import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { branch } from "baobab-react/higher-order";
import { Message } from "shared/components/sync";

const binding = (props, context) => {
	return {
		feed: ["feed"],
		user: ["user", "data"],
	};
};

@branch(binding)
export default class RedirectRoot extends Component {
	componentWillMount() {
		const { user } = this.props;
		if (!user) {
			window.location.href = "/login";
		}
	}

	render() {
		const { user } = this.props;
		const { latest, loaded } = this.props.feed;
		const syncing = user && user.syncing;

		return syncing ? (
			<Message />
		) : !loaded ? (
			undefined
		) : !user ? (
			undefined
		) : !latest ? (
			<Redirect to="/account/repos" />
		) : !latest.number ? (
			<Redirect to={`/${latest.slug}`} />
		) : (
			<Redirect to={`/${latest.slug}/${latest.number}`} />
		);
	}
}
