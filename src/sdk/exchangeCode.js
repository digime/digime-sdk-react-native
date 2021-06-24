import { getPayloadFromToken } from "./authorise";
import { createJWT } from "./jwt";

export const exchangeCodeForToken = async (options, sdkConfig) => {

    const { authorizationCode, codeVerifier, contractDetails } = options;
    const { contractId, privateKey, redirectUri } = contractDetails;

    if (!isNonEmptyString(authorizationCode)) {
        throw new TypeValidationError("Authorization code cannot be empty");
    }

    if (!isNonEmptyString(codeVerifier)) {
        throw new TypeValidationError("Code verifier must be empty or a string");
    }

    const jwt = createJWT(
        {
            client_id: `${sdkConfig.applicationId}_${contractId}`,
            code: authorizationCode,
            code_verifier: codeVerifier,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
        },
        privateKey,
    );

    try {
        const body = await request.func.post(
            getOauthTokenURL,
            sdkConfig,
            {
                responseType: "json",
                retry: sdkConfig.retryOptions,
            },
            {
                Authorization: `Bearer ${jwt}`
            });

        const payload = await getPayloadFromToken(body?.token);
        const response = await net.post(`${sdkConfig.baseUrl}oauth/token`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        console.log(payload)
        console.log(response)
        return 123

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
        //throw new AccessTokenExchangeError("Failed to exchange authorization code to access token.");
    }
};