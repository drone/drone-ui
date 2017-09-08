import React, { Component } from "react";
import styles from "./form.less";

export class Form extends Component {
	constructor(props) {
		super(props);
		this.clear = this.clear.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
	}

	_handleSubmit() {
		const { onsubmit } = this.props;
		const detail = {
			address: this.refs.address.value,
			username: this.refs.username.value,
			password: this.refs.password.value,
		};
		onsubmit({ detail });
		this.clear();
	}

	clear() {
		this.refs.address.value = "";
		this.refs.username.value = "";
		this.refs.password.value = "";
	}

	render() {
		const { onsubmit } = this.props;
		return (
			<div className={styles.form}>
				<input
					type="text"
					ref="address"
					placeholder="Registry Address (e.g. docker.io)"
				/>
				<input type="text" ref="username" placeholder="Registry Username" />
				<textarea rows="1" ref="password" placeholder="Registry Password" />
				<div className={styles.actions}>
					<button onClick={this._handleSubmit}>Save</button>
				</div>
			</div>
		);
	}
}
