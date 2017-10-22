import React from "react";
import { mount } from "enzyme";

import Status, { StatusLabel } from "../status";

import {
	STATUS_BLOCKED,
	STATUS_DECLINED,
	STATUS_ERROR,
	STATUS_FAILURE,
	STATUS_KILLED,
	STATUS_PENDING,
	STATUS_RUNNING,
	STATUS_SKIPPED,
	STATUS_STARTED,
	STATUS_SUCCESS,
} from "shared/constants/status";

jest.dontMock("../status");

describe("Status component", () => {
	test("updates on status change", () => {
		const status = mount(<Status status={STATUS_FAILURE} />);
		const instance = status.instance();

		expect(
			instance.shouldComponentUpdate({ status: STATUS_FAILURE }),
		).toBeFalsy();

		expect(
			instance.shouldComponentUpdate({ status: STATUS_SUCCESS }),
		).toBeTruthy();
	});

	describe("uses the status as the class name", () => {
		test("set class name for status STATUS_BLOCKED", () => {
			const status = mount(<Status status={STATUS_BLOCKED} />);
			expect(status.hasClass("blocked")).toBeTruthy();
		});

		test("set class name for status STATUS_DECLINED", () => {
			const status = mount(<Status status={STATUS_DECLINED} />);
			expect(status.hasClass("declined")).toBeTruthy();
		});

		test("set class name for status STATUS_ERROR", () => {
			const status = mount(<Status status={STATUS_ERROR} />);
			expect(status.hasClass("error")).toBeTruthy();
		});

		test("set class name for status STATUS_FAILURE", () => {
			const status = mount(<Status status={STATUS_FAILURE} />);
			expect(status.hasClass("failure")).toBeTruthy();
		});

		test("set class name for status STATUS_KILLED", () => {
			const status = mount(<Status status={STATUS_KILLED} />);
			expect(status.hasClass("killed")).toBeTruthy();
		});

		test("set class name for status STATUS_PENDING", () => {
			const status = mount(<Status status={STATUS_PENDING} />);
			expect(status.hasClass("pending")).toBeTruthy();
		});

		test("set class name for status STATUS_RUNNING", () => {
			const status = mount(<Status status={STATUS_RUNNING} />);
			expect(status.hasClass("running")).toBeTruthy();
		});

		test("set class name for status STATUS_SKIPPED", () => {
			const status = mount(<Status status={STATUS_SKIPPED} />);
			expect(status.hasClass("skipped")).toBeTruthy();
		});

		test("set class name for status STATUS_STARTED", () => {
			const status = mount(<Status status={STATUS_STARTED} />);
			expect(status.hasClass("started")).toBeTruthy();
		});

		test("set class name for status STATUS_SUCCESS", () => {
			const status = mount(<Status status={STATUS_SUCCESS} />);
			expect(status.hasClass("success")).toBeTruthy();
		});
	});
});

describe("StatusLabel component", () => {
	describe("appropriate status label", () => {
		test("set label for status STATUS_BLOCKED", () => {
			const status = mount(<StatusLabel status={STATUS_BLOCKED} />);
			expect(status.text()).toEqual("Pending Approval");
		});

		test("set label for status STATUS_DECLINED", () => {
			const status = mount(<StatusLabel status={STATUS_DECLINED} />);
			expect(status.text()).toEqual("Declined");
		});

		test("set label for status STATUS_ERROR", () => {
			const status = mount(<StatusLabel status={STATUS_ERROR} />);
			expect(status.text()).toEqual("Error");
		});

		test("set label for status STATUS_FAILURE", () => {
			const status = mount(<StatusLabel status={STATUS_FAILURE} />);
			expect(status.text()).toEqual("Failure");
		});

		test("set label for status STATUS_KILLED", () => {
			const status = mount(<StatusLabel status={STATUS_KILLED} />);
			expect(status.text()).toEqual("Cancelled");
		});

		test("set label for status STATUS_PENDING", () => {
			const status = mount(<StatusLabel status={STATUS_PENDING} />);
			expect(status.text()).toEqual("Pending");
		});

		test("set label for status STATUS_RUNNING", () => {
			const status = mount(<StatusLabel status={STATUS_RUNNING} />);
			expect(status.text()).toEqual("Running");
		});

		test("set label for status STATUS_STARTED", () => {
			const status = mount(<StatusLabel status={STATUS_STARTED} />);
			expect(status.text()).toEqual("Running");
		});

		test("set label for status STATUS_SKIPPED", () => {
			const status = mount(<StatusLabel status={STATUS_SKIPPED} />);
			expect(status.text()).toEqual("Skipped");
		});

		test("set label for status STATUS_SUCCESS", () => {
			const status = mount(<StatusLabel status={STATUS_SUCCESS} />);
			expect(status.text()).toEqual("Successful");
		});
	});
});
