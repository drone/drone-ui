import React from "react";
import { mount } from "enzyme";

import BuildTime from "../build_time";

jest.dontMock("../build_time");

jest.mock("react-timeago");

describe("BuildTime component", () => {
	const start = Math.floor(
		new Date("Sun Oct 22 2017 14:43:19 GMT+0200 (CEST)") / 1000,
	);
	const end = Math.floor(
		new Date("Sun Oct 22 2017 15:32:16 GMT+0200 (CEST)") / 1000,
	);

	test("display build time when no date available", () => {
		const status = mount(<BuildTime />);

		expect(
			status
				.find(".host .row div")
				.at(1)
				.text(),
		).toEqual("");
		expect(
			status
				.find(".host .row div")
				.at(2)
				.text(),
		).toEqual("--");
		expect(
			status
				.find(".host .row div")
				.at(3)
				.text(),
		).toEqual("--");
		expect(
			status
				.find(".host .row div")
				.at(4)
				.text(),
		).toEqual("");
	});

	test("display build time with start", () => {
		const status = mount(<BuildTime start={start} />);

		expect(
			status
				.find(".host .row div")
				.at(1)
				.text(),
		).toEqual("");
		expect(
			status
				.find(".host .row div")
				.at(2)
				.text(),
		).toEqual("TimeAgo");
		expect(
			status
				.find(".host .row div")
				.at(3)
				.text(),
		).toEqual("TimeAgo");
		expect(
			status
				.find(".host .row div")
				.at(4)
				.text(),
		).toEqual("TimeAgo");
	});

	test("display build time", () => {
		const status = mount(<BuildTime start={start} finish={end} />);

		expect(
			status
				.find(".host .row div")
				.at(1)
				.text(),
		).toEqual("");
		expect(
			status
				.find(".host .row div")
				.at(2)
				.text(),
		).toEqual("TimeAgo");
		expect(
			status
				.find(".host .row div")
				.at(3)
				.text(),
		).toEqual("TimeAgo");
		expect(
			status
				.find(".host .row div")
				.at(4)
				.text(),
		).toEqual("48 minutes, 57 seconds");
	});
});
