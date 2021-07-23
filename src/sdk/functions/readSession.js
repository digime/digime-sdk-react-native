import {getTriggerURL} from "../../constants/urlPaths";
import {createJWT} from "../jwt";
import {refreshToken} from "./refreshTokens";
import {request} from "../request";
import { getAuthHeader } from "../../utils/url";
import "../../definitions/defs";

/**
 *
 * @async
 * @function readSession
 * @param {{contractDetails, userAccessToken, scope}} props
 * @param {sdkConfig} sdkConfig
 * @returns
 */
export const readSession = async (props, sdkConfig) => {
	const {contractDetails, userAccessToken, scope} = props;
	let session;

	// 1. We have an access token, try and trigger a data request
	try {
		session = await triggerDataQuery({
			accessToken: userAccessToken.accessToken.value,
			contractDetails,
			scope
		}, sdkConfig);

		return {session};
	} catch (error) {
		/* Invalid tokens */
		// get and refresh
	}

	const newTokens = await refreshToken({
		contractDetails,
		userAccessToken
	}, sdkConfig);

	session = await triggerDataQuery({
		accessToken: newTokens.accessToken.value,
		contractDetails,
		scope
	}, sdkConfig);

	return {session, updatedAccessToken: newTokens};
};

/**
 *
 * @async
 * @function triggerDataQuery
 * @param {{accessToken: access_token, contractDetails, scope}} props
 * @param {sdkConfig} sdkConfig
 * @returns
 */
const triggerDataQuery = async (props, sdkConfig) => {
	const {accessToken: access_token, contractDetails, scope} = props;
	const {contractId, privateKey, redirectUri: redirect_uri} = contractDetails;
	const {applicationId} = sdkConfig;

	const jwt = await createJWT({
		access_token,
		redirect_uri
	},
	{
		applicationId,
		contractId,
	},
	privateKey);

	const {data:body} = await request.func.post(
		getTriggerURL,
		sdkConfig,
		{
			scope
		},
		{
			...getAuthHeader(jwt)
		}
	);

	const session = body?.session;
	return session;
};
