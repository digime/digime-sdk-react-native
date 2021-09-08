const {SDKInvalidError, ServerError} = require("../errors/errors");
import {handleServerResponse} from "./handleServerResponse";

describe("HandleServerResponse", () => {
	let error;
	beforeEach(() => {
		error = {
			response: {
				body: {
					error: {
						code: "test_code",
						message: "test_message"
					}
				}
			}
		};
	});

	it.each(["SDKInvalid", "SDKVersionInvalid"])("Will throw SDKInvalidError on %p from API", (apiErrorCode) => {
		error.response.body.error.code = apiErrorCode;
		expect(() => handleServerResponse(error)).toThrow(SDKInvalidError);
	});

	it("Will throw ServerError by default", () => {
		expect(() => handleServerResponse(error)).toThrowError(ServerError);
	});
});
