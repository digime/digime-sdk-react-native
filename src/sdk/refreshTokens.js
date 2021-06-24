import { getOauthTokenURL } from "../constants/urlPaths";
import { getPayloadFromToken } from "./authorise";
import { createJWT } from "./jwt";

export const refreshToken = async (options, sdkConfig) => {
    const { contractDetails, userAccessToken } = options;
    const { contractId, privateKey, redirectUri } = contractDetails;

    const jwt = await createJWT(
        {
            client_id: `${sdkConfig.applicationId}_${contractId}`,
            grant_type: "refresh_token",
            redirect_uri: redirectUri,
            refresh_token: userAccessToken.refreshToken.value,
        },
        privateKey
    );

    try {

        const body = await request.func.post(
            getOauthTokenURL,
            sdkConfig,
            {},
            {
                Authorization: `Bearer ${jwt}`
            });

        const payload = await getPayloadFromToken(body?.token, sdkConfig);

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

    } catch (error) {
        if (!(error instanceof HTTPError)) {
            throw error;
        }

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

        throw error;
    }
};