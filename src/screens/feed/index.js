import React, { Component } from "react";
import { Link } from "react-router-dom";

import { compareFeedItem } from "shared/utils/feed";

import { branch } from "baobab-react/higher-order";
import { inject } from "config/client/inject";

import DroneIcon from "shared/components/logo";
import { List, Item } from "./components";

import style from "./index.less";

import Collapsible from 'react-collapsible';

const binding = (props, context) => {
	return { feed: ["feed"] };
};

@inject
@branch(binding)
export default class Sidebar extends Component {
	constructor(props, context) {
		super(props, context);

		this.setState({
			favs: JSON.parse(localStorage.getItem('favs') || '[]'),
			favsOpen: localStorage.getItem('favsOpen') === "true",
			allOpen: localStorage.getItem('allOpen') === "true"
		});

		this.handleFilter = this.handleFilter.bind(this);
		this.toggleFavs = this.toggleItem.bind(this, 'favsOpen');
		this.toggleAll = this.toggleItem.bind(this, 'allOpen');
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.props.feed !== nextProps.feed ||
			this.state.filter !== nextState.filter ||
			this.state.favs.length !== nextState.favs.length
		);
	}

	handleFilter(e) {
		this.setState({
			filter: e.target.value,
		});
	}

	toggleItem = item => {
		localStorage.setItem(item, !(localStorage.getItem(item) === "true"));
	}

	renderFeed = (list, renderFavs) => {
		return (
			<div>
				<List>{list.map(item => this.renderItem(item, renderFavs))}</List>
			</div>
		);
	}

	renderItem = (item, renderFavs) => {
		const favs = this.state.favs;
		if (renderFavs && !favs.includes(item.full_name)) {
			return null;
		}
		return (
			<Link to={`/${item.full_name}`} key={item.full_name}>
				<Item item={item} onFave={this.onFave} faved={favs.includes(item.full_name)}/>
			</Link>
		);
	}

	onFave = full_name => {
		if (!this.state.favs.includes(full_name)) {
			this.setState(state => {
				const list = state.favs.concat(full_name);

				return {
					favs: list
				}
			});
		} else {
			this.setState(state => {
				const list = state.favs.filter(v => v !== full_name);

				return {
					favs: list
				}
			});
		}

		localStorage.setItem('favs', JSON.stringify(this.state.favs));
	}

	render() {
		const { feed } = this.props;
		const { filter } = this.state;

		const list = feed.data ? Object.values(feed.data) : [];

		const filterFunc = item => {
			return !filter || item.full_name.indexOf(filter) !== -1;
		};

		const filtered = list.filter(filterFunc).sort(compareFeedItem);
		const favsOpen = this.state.favsOpen;
		const allOpen = this.state.allOpen;
		return (
			<div className={style.feed}>
				{LOGO}
				<Collapsible trigger="Starred" triggerTagName="div" transitionTime={200} open={favsOpen} onOpen={this.toggleFavs} onClose={this.toggleFavs} triggerOpenedClassName={style.Collapsible__trigger} triggerClassName={style.Collapsible__trigger}>
					{feed.loaded === false ? (
						LOADING
					) : feed.error ? (
						ERROR
					) : list.length === 0 ? (
						EMPTY
					) : (
						this.renderFeed(list, true)
					)}
				</Collapsible>
				<Collapsible trigger="Repos" triggerTagName="div" transitionTime={200} open={allOpen} onOpen={this.toggleAll} onClose={this.toggleAll} triggerOpenedClassName={style.Collapsible__trigger} triggerClassName={style.Collapsible__trigger}>
					<input
						type="text"
						placeholder="Search …"
						onChange={this.handleFilter}
					/>
					{feed.loaded === false ? (
						LOADING
					) : feed.error ? (
						ERROR
					) : list.length === 0 ? (
						EMPTY
					) : filtered.length > 0 ? (
						this.renderFeed(filtered.sort(compareFeedItem), false)
					) : (
						NO_MATCHES
					)}
				</Collapsible>
			</div>
		);
	}
}

const LOGO = (
	<div className={style.brand}>
		<DroneIcon />
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
