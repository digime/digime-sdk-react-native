import { refreshToken } from "./refreshTokens";
import { handleServerResponse } from "../http/handleServerResponse";
import { sdkConfig, userAccessToken, contractDetails } from "../../definitions/defs";

/**
 * @async
 * @function refreshTokenWrapper
 * @param {function(props, sdkConfig):any} operationFn
 * @param {{contractDetails:contractDetails, userAccessToken:userAccessToken}} props
 * @param {sdkConfig} sdkConfig
 * @returns
 */
export const refreshTokenWrapper = async(operationFn, props, sdkConfig) => {
	try {
		return await operationFn(props, sdkConfig);
	} catch (error) {
		// TODO: handle the status errors
		/*
        if (!(error instanceof HTTPError)) {
            throw error;
        }
		*/

		//if (error.response.statusCode !== 401) {
			handleServerResponse(error);
		//}
	}

	const {contractDetails, userAccessToken} = props;

	const newTokens = await refreshToken({
		contractDetails,
		userAccessToken
	},
	sdkConfig
	);

	return await operationFn({
		...props,
		userAccessToken: newTokens,
	},
	sdkConfig
	);
};