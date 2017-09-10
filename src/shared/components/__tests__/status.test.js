import React, { Component } from "react";
import sinon from "sinon";
import { expect } from "chai";
import { shallow, mount, render } from "enzyme";

jest.dontMock("../status");

import Status from "../status";
import {
	STATUS_FAILURE,
	STATUS_RUNNING,
	STATUS_SUCCESS
} from "shared/constants/status";

describe("Status component", () => {
	test("updates on status change", () => {
		const status = mount(<Status status={STATUS_FAILURE} />);
		const instance = status.instance();
		expect(instance.shouldComponentUpdate({ status: STATUS_FAILURE })).to.be.false;
		expect(instance.shouldComponentUpdate({ status: STATUS_SUCCESS })).to.be.true;
		expect(status.hasClass("failure")).to.be.true;
	});

	test("uses the status as the class name", () => {
		const status = mount(<Status status={STATUS_RUNNING} />);
		expect(status.hasClass("running")).to.be.true;
	});
});
