import {notValidStrings} from "../../tests/constants/testConstants";
import {TypeValidationError} from "./errors/errors";
import {openUrl} from "./webBrowser";

let mockOpenIntFn;
let mockIsAvailFn;
let mockOpenExtFn;

jest.mock("react-native", () => {
	mockOpenExtFn = jest.fn(() => Promise.resolve(true));

	return {
		Linking: {
			canOpenURL: jest.fn(() => Promise.resolve(true)),
			openURL: mockOpenExtFn
		}
	};
});

jest.mock("react-native-inappbrowser-reborn", () => {
	mockOpenIntFn = jest.fn(() => Promise.resolve(true));

	mockIsAvailFn = jest.fn(() => Promise.resolve(true));

	return {
		InAppBrowser: {
			isAvailable: mockIsAvailFn,
			openAuth: mockOpenIntFn
		}
	};
});

describe("Browser", () => {
	describe("Errors", () => {
		it.each(notValidStrings)("Will throw TypeValidationError when url is `%p`", (option) => {
			expect(openUrl(option)).rejects.toThrow(TypeValidationError);
		});

		it("Will throw TypeValidationError error when (browser) type isn't 'internal' or 'external'", async () => {
			expect(openUrl("test_url", "not_supported_type")).rejects.toThrow(TypeValidationError);
		});
	});

	describe("Behaviours", () => {
		it("Will open in the internal browser, when set", async () => {
			await openUrl("test_url", "internal");
			expect(mockOpenIntFn).toBeCalledTimes(1);
		});
		it("Will open in the external browser, when set", async () => {
			await openUrl("test_url", "external");
			expect(mockOpenExtFn).toBeCalledTimes(1);
		});
	});
});
