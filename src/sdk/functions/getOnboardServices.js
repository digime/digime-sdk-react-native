import { getServiceOnboardURL, getTokenReferenceURL } from "../../constants/urlPaths";
import {createJWT} from "../jwt";
import { request } from "../request";

import { getPayloadFromToken } from "./authorise";
import { URL, URLSearchParams } from "react-native-url-polyfill";
import { refreshTokenWrapper } from "./refreshTokenWrapper";
import { getAuthHeader } from "../../utils/url";

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
			client_id: `${applicationId}_${contractId}`,
			redirect_uri: redirectUri,
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

export const getOnboardServiceUrl = async (props, sdkConfiguration) => {
	return refreshTokenWrapper(getOnboardServiceFn, props, sdkConfiguration);
};
