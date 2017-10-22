import React from "react";
import { mount } from "enzyme";

import { STATUS_SUCCESS } from "shared/constants/status";

import StatusNumber from "../status_number";

jest.dontMock("../status_number");

describe("StatusNumber component", () => {
	test("display build number", () => {
		const status = mount(<StatusNumber status={STATUS_SUCCESS} number="100" />);

		expect(status.text()).toEqual("100");
	});
});
