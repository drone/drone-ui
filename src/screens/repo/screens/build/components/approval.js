import React, { Component } from "react";
import style from "./approval.less";

export const Approval = ({ onapprove, ondecline }) => (
	<div className={style.root}>
		<p>Pipeline execution is blocked pending administrator approval</p>
		<button onclick={onapprove}>Approve</button>
		<button onclick={ondecline}>Decline</button>
	</div>
);
