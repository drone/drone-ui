import React, { Component } from "react";
import ansi_up from "ansi_up";
import style from "./term.less";

let formatter = new ansi_up();
formatter.use_classes = true;

class Term extends Component {
	render() {
		const { lines, exitcode } = this.props;
		return (
			<div className={style.term}>
				{lines.map(renderTermLine)}
				{exitcode !== undefined ? renderExitCode(exitcode) : undefined}
			</div>
		);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.props.lines !== nextProps.lines ||
			this.props.exitcode !== nextProps.exitcode
		);
	}
}

class TermLine extends Component {
	render() {
		const { line } = this.props;
		return (
			<div className={style.line} key={line.pos}>
				<div>{line.pos + 1}</div>
				<div dangerouslySetInnerHTML={{ __html: this.colored }} />
				<div>{line.time || 0}s</div>
			</div>
		);
	}

	get colored() {
		return formatter.ansi_to_html(this.props.line.out || "");
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.line.out !== nextProps.line.out;
	}
}

const renderTermLine = line => {
	return <TermLine line={line} />;
};

const renderExitCode = code => {
	return <div className={style.exitcode}>exit code {code}</div>;
};

const TermError = () => {
	return (
		<div className={style.error}>
			Oops. There was a problem loading the logs.
		</div>
	);
};

const TermLoading = () => {
	return <div className={style.loading}>Loading ...</div>;
};

Term.Line = TermLine;
Term.Error = TermError;
Term.Loading = TermLoading;

export default Term;
