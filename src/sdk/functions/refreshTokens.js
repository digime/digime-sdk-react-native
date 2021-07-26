import { getOauthTokenURL } from "../../constants/urlPaths";
import { getPayloadFromToken } from "./authorise";
import { createJWT } from "../jwt";
import { request } from "../http/request";
import { getAuthHeader } from "../../utils/url";
import { DigiMeSDKError } from "../errors/errors";
import "../../definitions/defs";

/**
 * Refreshes the Access Token
 * @async
 * @function refreshToken
 * @param {{contractDetails:contractDetails, userAccessToken:userAccessToken}} props
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<userAccessToken>}
 */
export const refreshToken = async (props, sdkConfig) => {
	const { contractDetails, userAccessToken } = props;
	const { contractId, privateKey, redirectUri } = contractDetails;
	const {applicationId} = sdkConfig;

	const jwt = await createJWT(
		{
			grant_type: "refresh_token",
			redirect_uri: redirectUri,
			refresh_token: userAccessToken.refreshToken.value,
		},
		{
			applicationId,
			contractId,
		},
		privateKey
	);

	try {
		const {data:body} = await request.func.post(
			getOauthTokenURL,
			sdkConfig,
			{},
			{
				...getAuthHeader(jwt)
			});

		const {
			access_token,
			refresh_token
		} = await getPayloadFromToken(body?.token, sdkConfig);

		/*
        // original
        return {
            accessToken: {
                value: get(payload, ["access_token", "value"]),
                expiry: get(payload, ["access_token", "expires_on"]),
            },
            refreshToken: {
                value: get(payload, ["refresh_token", "value"]),
                expiry: get(payload, ["refresh_token", "expires_on"]),
            },
        };
        */

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
		/*
        if (!(error instanceof HTTPError)) {
            throw error;
        }

        // TODO: check these error codes, and object paths are correct
        const errorCode = get(error, "body.error.code");

        if (
            errorCode === "InvalidJWT" ||
            errorCode === "InvalidRequest" ||
            errorCode === "InvalidRedirectUri" ||
            errorCode === "InvalidGrant" ||
            errorCode === "InvalidToken" ||
            errorCode === "InvalidTokenType"
        ) {
            throw new OAuthError(get(error, "body.error.message"));
        }
        */

		//throw error;
		throw new DigiMeSDKError(error);
	}
};