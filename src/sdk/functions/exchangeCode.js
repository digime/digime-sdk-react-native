import { getOauthTokenURL } from "../../constants/urlPaths";
import { getPayloadFromToken } from "./authorise";
import { createJWT } from "../jwt";
import { request } from "../http/request";
import { getAuthHeader } from "../../utils/url";
import { TypeValidationError } from "../errors/errors";
import { isNonEmptyString } from "../../utils/stringUtils";

import { handleServerResponse } from "../http/handleServerResponse";

import { sdkConfig, exchangeCodeForTokenProps, exchangeCodeForTokenResponse, userAccessToken} from "../../definitions/defs";

/**
 * Exchange Auth Code for a {@link userAccessToken}
 * This is called when authorization flow successfully completed, and you have been given an authorization code. We can then use this function to exchange for an access token.
 * @example
 * // obtain the UserAccessToken
 *  const userAccessToken = await sdkFunctions.exchangeCodeForToken({
 *		codeVerifier, // from `getAuthUrl()`
 *		authorizationCode: responseCode, // from `getAuthUrl()` callback
 *		contractDetails
 *	});
 * @async
 * @function exchangeCodeForToken
 * @param {exchangeCodeForTokenProps} props
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<exchangeCodeForTokenResponse>}
 */
export const exchangeCodeForToken = async (props, sdkConfig) => {
	const { authorizationCode, codeVerifier, contractDetails } = props;
	const { contractId, privateKey, redirectUri } = contractDetails;
	const {applicationId} = sdkConfig;

	if (!isNonEmptyString(authorizationCode)) {
		throw new TypeValidationError("Authorization code cannot be empty");
	}

	if (!isNonEmptyString(codeVerifier)) {
		throw new TypeValidationError("Code verifier must be empty or a string");
	}

	const jwt = await createJWT(
		{
			code: authorizationCode,
			code_verifier: codeVerifier,
			grant_type: "authorization_code",
			redirect_uri: redirectUri,
		},
		{
			applicationId,
			contractId,
		},
		privateKey,
	);

	try {
		const {data:body} = await request.func.post(
			getOauthTokenURL,
			sdkConfig,
			{
				responseType: "json",
				retry: sdkConfig.retryOptions,
			},
			{
				...getAuthHeader(jwt)
			});

		const {
			access_token,
			refresh_token
		} = await getPayloadFromToken(body?.token);

		const getParam = (obj) => {
			const {
				expires_on: expires,
				value,
			} = obj;
			return {
				expires,
				value
			};
		};

		return {
			accessToken: {...getParam(access_token)},
			refreshToken: {...getParam(refresh_token)},
		};
	} catch (error) {
		handleServerResponse(error);
	}
};