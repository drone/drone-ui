import React, { Component } from "react";
import sinon from "sinon";
import { expect } from "chai";
import { shallow, mount, render } from "enzyme";

jest.dontMock("../status");

import Status from "../status";

describe("Status component", () => {
	test("updates on status change", () => {
		const status = mount(<Status status="failure" />);
		const instance = status.instance();
		expect(instance.shouldComponentUpdate({ status: "failure" })).to.be.false;
		expect(instance.shouldComponentUpdate({ status: "success" })).to.be.true;
		expect(status.hasClass("failure")).to.be.true;
	});

	test("uses the status as the class name", () => {
		const status = mount(<Status status="running" />);
		expect(status.hasClass("running")).to.be.true;
	});
});
