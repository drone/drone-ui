import React, { Component } from "react";
import styles from "./form.less";

export class Form extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			name: "",
			value: "",
		};

		this._handleNameChange = this._handleNameChange.bind(this);
		this._handleValueChange = this._handleValueChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);

		this.clear = this.clear.bind(this);
	}

	_handleNameChange(event) {
		this.setState({ name: event.target.value });
	}

	_handleValueChange(event) {
		this.setState({ value: event.target.value });
	}

	_handleSubmit() {
		const { onsubmit } = this.props;

		const detail = {
			name: this.state.name,
			value: this.state.value,
		};

		onsubmit({ detail });
		this.clear();
	}

	clear() {
		this.setState({ name: "" });
		this.setState({ value: "" });
	}

	render() {
		return (
			<div className={styles.form}>
				<input
					type="text"
					name="name"
					value={this.state.name}
					placeholder="Secret Name"
					onChange={this._handleNameChange}
				/>
				<input
					type="password"
					name="value"
					value={this.state.value}
					placeholder="Secret Value"
					onChange={this._handleValueChange}
				/>
				<div className={styles.actions}>
					<button onClick={this._handleSubmit}>Save</button>
				</div>
			</div>
		);
	}
}
