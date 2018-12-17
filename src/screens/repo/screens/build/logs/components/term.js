import React, { Component } from "react";
import AnsiUp from "ansi_up";
import style from "./term.less";

let formatter = new AnsiUp();
formatter.use_classes = true;

class Term extends Component {
	render() {
		const { lines, exitcode } = this.props;
		return (
			<div className={style.term}>
				{stitchLines(lines).map(renderTermLine)}
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

const isEOL = line => {
	return line.out.charAt(line.out.length - 1) === "\n";
};

const stitchLines = lines => {
	return lines.reduce(
		(stitchedLines, line) => {
			let lastLine = stitchedLines[stitchedLines.length - 1];

			if (isEOL(lastLine)) {
				let newLine = Object.assign({}, line);
				newLine.pos = stitchedLines.length + 1;

				return stitchedLines.concat(newLine);
			} else {
				lastLine.out = lastLine.out.concat(line.out);

				return stitchedLines;
			}
		},
		[Object.assign({}, lines[0])],
	);
};

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
