import React, { Component } from "react";
import { Link } from "react-router-dom";

import styles from "./menu.less";

export default class RepoMenu extends Component {
	render() {
		const { owner, repo } = this.props.match.params;
		return (
			<section>
				<ul>
					<li>
						<Link to={`/${owner}/${repo}`}>Builds</Link>
					</li>
					<li>
						<Link to={`/${owner}/${repo}/settings/secrets`}>Secrets</Link>
					</li>
					<li>
						<Link to={`/${owner}/${repo}/settings/registry`}>Registry</Link>
					</li>
					<li>
						<Link to={`/${owner}/${repo}/settings`}>Settings</Link>
					</li>
				</ul>
			</section>
		);
	}
}
