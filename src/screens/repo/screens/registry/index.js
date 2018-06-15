import React, { Component } from "react";

import { repositorySlug } from "shared/utils/repository";
import {
	fetchRegistryList,
	createRegistry,
	deleteRegistry,
} from "shared/utils/registry";

import { branch } from "baobab-react/higher-order";
import { inject } from "config/client/inject";

import { List, Item, Form } from "./components";

import styles from "./index.less";

const binding = (props, context) => {
	const { namespace, name } = props.match.params;
	const slug = repositorySlug(namespace, name);
	return {
		loaded: ["registry", "loaded"],
		registries: ["registry", "data", slug],
	};
};

@inject
@branch(binding)
export default class RepoRegistry extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleDelete = this.handleDelete.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.registries !== nextProps.registries;
	}

	componentWillMount() {
		const { dispatch, drone, match } = this.props;
		const { namespace, name } = match.params;
		dispatch(fetchRegistryList, drone, namespace, name);
	}

	handleSave(e) {
		const { dispatch, drone, match } = this.props;
		const { namespace, name } = match.params;
		const registry = {
			address: e.detail.address,
			username: e.detail.username,
			password: e.detail.password,
		};

		dispatch(createRegistry, drone, namespace, name, registry);
	}

	handleDelete(registry) {
		const { dispatch, drone, match } = this.props;
		const { namespace, name } = match.params;
		dispatch(deleteRegistry, drone, namespace, name, registry.address);
	}

	render() {
		const { registries, loaded } = this.props;

		if (!loaded) {
			return LOADING;
		}

		return (
			<div className={styles.root}>
				<div className={styles.left}>
					{Object.keys(registries || {}).length === 0 ? EMPTY : undefined}
					<List>
						{Object.values(registries || {}).map(renderRegistry.bind(this))}
					</List>
				</div>

				<div className={styles.right}>
					<Form onsubmit={this.handleSave} />
				</div>
			</div>
		);
	}
}

function renderRegistry(registry) {
	return (
		<Item
			name={registry.address}
			ondelete={this.handleDelete.bind(this, registry)}
		/>
	);
}

const LOADING = <div className={styles.loading}>Loading</div>;

const EMPTY = (
	<div className={styles.empty}>
		There are no registry credentials for this repository.
	</div>
);
