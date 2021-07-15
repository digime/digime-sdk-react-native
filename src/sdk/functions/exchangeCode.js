import { getOauthTokenURL } from "../../constants/urlPaths";
import { getPayloadFromToken } from "./authorise";
import { createJWT } from "../jwt";
import { request } from "../request";
import { getAuthHeader } from "../../utils/url";

export const exchangeCodeForToken = async (props, sdkConfig) => {
    const { authorizationCode, codeVerifier, contractDetails } = props;
    const { contractId, privateKey, redirectUri } = contractDetails;

    /*
    // TODO: Add string validation here...
    if (!isNonEmptyString(authorizationCode)) {
        throw new TypeValidationError("Authorization code cannot be empty");
    }

    if (!isNonEmptyString(codeVerifier)) {
        throw new TypeValidationError("Code verifier must be empty or a string");
    }
    */

    const jwt = await createJWT(
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
          }

        return {
            accessToken: {
                ...getParam(access_token),
            },
            refreshToken: {
                ...getParam(refresh_token),
            },
        };
    } catch (error) {
        // TODO: Add error
        console.log("error")
        throw new (error)
        //throw new AccessTokenExchangeError("Failed to exchange authorization code to access token.");
    }
};