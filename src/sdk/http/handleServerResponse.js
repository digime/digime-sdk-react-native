import {ServerError, SDKInvalidError} from "../errors/errors";
import { isString } from "lodash";

/**
 * @private
 * @function handleServerResponse
 * @param {*} error
 * @returns null
 */
export const handleServerResponse = error => {
	// if (!(error instanceof HTTPError)) {
	// 	return;
	// }

	let body = error.response.body;

	if (Buffer.isBuffer(body)) {
		body = body.toString("utf8");
	}

	// Attempt to parse body in case it's a string
	if (isString(body)) {
		try {
			body = JSON.parse(body);
		} catch {
			return;
		}
	}

	// if (!isApiErrorResponse(body)) {
	// 	return;
	// }

	const { code, message } = body.error;

	if (code === "SDKInvalid" || code === "SDKVersionInvalid") {
		throw new SDKInvalidError(message, body.error);
	}

	throw new ServerError(message, body.error);
};