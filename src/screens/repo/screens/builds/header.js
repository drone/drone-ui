import React, { Component } from "react";
import { Link } from "react-router-dom";

import Breadcrumb, {
	SEPARATOR,
	BACK_BUTTON,
} from "shared/components/breadcrumb";

import style from "./header.less";

export default class Header extends Component {
	render() {
		const { owner, repo, build } = this.props.match.params;
		return (
			<div>
				<Breadcrumb
					elements={[
						<Link to={`/${owner}/${repo}`}>
							{owner} / {repo}
						</Link>,
					]}
				/>
			</div>
		);
	}
}
