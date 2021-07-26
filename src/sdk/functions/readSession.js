import {getTriggerURL} from "../../constants/urlPaths";
import {createJWT} from "../jwt";
import {refreshToken} from "./refreshTokens";
import {request} from "../http/request";
import { getAuthHeader } from "../../utils/url";
import "../../definitions/defs";

/**
 *
 * @async
 * @function readSession
 * @param {readSessionProps} props
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<readSessionResponse>}
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
		// by continuing in the flow below
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

	return {
		session,
		updatedAccessToken: newTokens
	};
};

/**
 * Trigger data
 * @async
 * @function triggerDataQuery
 * @param {{accessToken:string, contractDetails:contractDetails, scope}} props
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<string>}
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
