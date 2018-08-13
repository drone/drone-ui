import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class nameMenu extends Component {
	render() {
		const { namespace, name } = this.props.match.params;
		return (
			<section>
				<ul>
					<li>
						<Link to={`/${namespace}/${name}`}>Builds</Link>
					</li>
					<li>
						<Link to={`/${namespace}/${name}/settings`}>Settings</Link>
					</li>
				</ul>
			</section>
		);
	}
}
