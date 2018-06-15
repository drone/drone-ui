import React, { Component } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "shared/components/breadcrumb";

export default class Header extends Component {
	render() {
		const { namespace, name } = this.props.match.params;
		return (
			<div>
				<Breadcrumb
					elements={[
						<Link to={`/${namespace}/${name}`} key={`${namespace}-${name}`}>
							{namespace} / {name}
						</Link>,
					]}
				/>
			</div>
		);
	}
}
