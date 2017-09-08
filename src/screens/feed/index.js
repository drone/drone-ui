import React, { Component } from "react";
import { Link } from "react-router-dom";

import { compareFeedItem } from "shared/utils/feed";

import { branch } from "baobab-react/higher-order";
import { inject } from "config/client/inject";

import DroenIcon from "shared/components/logo";
import { List, Item } from "./components";

import style from "./index.less";

const binding = (props, context) => {
	return { feed: ["feed"] };
};

@inject
@branch(binding)
export default class Sidebar extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleFilter = this.handleFilter.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.props.feed !== nextProps.feed ||
			this.state.filter !== nextState.filter
		);
	}

	handleFilter(e) {
		this.setState({
			filter: e.target.value,
		});
	}

	render() {
		const { feed } = this.props;
		const { filter } = this.state;

		const list = feed.data ? Object.values(feed.data) : [];

		const filterFunc = item => {
			return !filter || item.full_name.indexOf(filter) !== -1;
		};

		const filtered = list.filter(filterFunc).sort(compareFeedItem);

		return (
			<div className={style.feed}>
				{LOGO}
				<input
					type="text"
					placeholder="Search …"
					onchange={this.handleFilter}
				/>
				{feed.loaded === false ? (
					LOADING
				) : feed.error ? (
					ERROR
				) : list.length === 0 ? (
					EMPTY
				) : filtered.length > 0 ? (
					renderFeed(filtered)
				) : (
					NO_MATCHES
				)}
			</div>
		);
	}
}

const renderFeed = list => {
	return <List>{list.map(renderItem)}</List>;
};

const renderItem = item => {
	return (
		<Link to={`/${item.full_name}`} key={item.full_name}>
			<Item item={item} />
		</Link>
	);
};

const LOGO = (
	<div className={style.brand}>
		<DroenIcon />
	</div>
);

const LOADING = <div className={style.message}>Loading</div>;

const EMPTY = <div className={style.message}>Your build feed is empty</div>;

const NO_MATCHES = <div className={style.message}>No results found</div>;

const ERROR = (
	<div className={style.message}>
		Oops. It looks like there was a problem loading your feed
	</div>
);
