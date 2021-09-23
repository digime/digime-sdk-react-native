import { getServiceOnboardURL, getTokenReferenceURL } from "../../constants/urlPaths";
import {createJWT} from "../jwt";
import { request } from "../http/request";


import { getPayloadFromToken } from "./authorise";
import { URL, URLSearchParams } from "react-native-url-polyfill";
import { refreshTokenWrapper } from "./refreshTokenWrapper";
import { getAuthHeader } from "../../utils/url";

import { sdkConfig, getOnboardServiceUrlProps, getOnboardServiceUrlResponse, contractDetails, userAccessToken } from "../../definitions/defs";

/**
 * @async
 * @private
 * @function getOnboardServiceFn
 * @param {{ userAccessToken:userAccessToken, contractDetails:contractDetails }} props
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<{url:string, userAccessToken:userAccessToken, session:string}>}
 */
const getOnboardServiceFn = async (props, sdkConfig) => {
	// TODO: add validation
	/*
    if (!GetOnboardServiceUrlCodec.is(props) || isNaN(props.serviceId) || !isNonEmptyString(props.callback)) {
        throw new TypeValidationError("Error on getOnboardServiceUrl(). Incorrect parameters passed in.");
    }
    */

	const {
		onboardUrl,
		applicationId,
		autoRedirect
	} = sdkConfig;

	const { userAccessToken, contractDetails } = props;
	const { contractId, privateKey, redirectUri } = contractDetails;

	const jwt = await createJWT(
		{
			access_token: userAccessToken.accessToken.value,
			redirect_uri: redirectUri,
		},
		{
			applicationId,
			contractId,
		},
		privateKey
	);

	const {data:body} = await request.func.post(getTokenReferenceURL,
		sdkConfig,
		{},
		{
			...getAuthHeader(jwt)
		});

	const {
		reference_code: code
	} = await getPayloadFromToken(body?.token, sdkConfig);

	const session = body?.session;

	const result = new URL(getServiceOnboardURL({baseUrl:onboardUrl}));
	result.search = new URLSearchParams({
		code,
		callback: props.callback,
		service: props.serviceId.toString(),
		autoRedirect,
	}).toString();

	return {
		url: result.toString(),
		session,
		userAccessToken: props.userAccessToken,
	};
};

/**
 * This is called when we already have a valid user access token for this user and we want to add more services to this user’s library.
 * Similar to `getAuthorizationUrl()` - currently this only accepts one service at a time.
 * @example
 * // get the auth url to onboard more services
 * const {
 *		session:{
 *			expiry: _expiry,
 *			key: session,
 *		},
 *		url: _serviceUrl,
 *		userAccessToken: _userAccessToken
 *	} = await sdkState.sdkFunctions.getOnboardServiceUrl({
 *		callback, // deeplink callback setup from `sdk.AppLlinking.init(YOUR_APP_SCHEME).addRoute(APP_ROUTE)`
 *		contractDetails,
 *		serviceId, // selected `serviceId` from `getAvailableServices()` to onboard
 *		userAccessToken
 *	});
 * @async
 * @function getOnboardServiceUrl
 * @param {getOnboardServiceUrlProps} props
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<getOnboardServiceUrlResponse>}
 */
export const getOnboardServiceUrl = async (props, sdkConfig) => {
	return refreshTokenWrapper(getOnboardServiceFn, props, sdkConfig);
};
