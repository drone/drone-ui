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
			name: this.refs.name.value,
			value: this.refs.value.value,
		};
		onsubmit({ detail });
		this.clear();
	}

	clear() {
		this.refs.name.value = "";
		this.refs.value.value = "";
	}

	render() {
		const { onsubmit } = this.props;
		return (
			<div className={styles.form}>
				<input type="text" ref="name" placeholder="Secret Name" />
				<textarea rows="1" ref="value" placeholder="Secret Value" />
				<div className={styles.actions}>
					<button onClick={this._handleSubmit}>Save</button>
				</div>
			</div>
		);
	}
}
