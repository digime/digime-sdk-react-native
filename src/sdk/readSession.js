import { getTriggerURL } from "../constants/urlPaths";
import { createJWT } from "./jwt";
import { refreshToken } from "./refreshTokens";

export const readSession = async (props, sdkConfig) => {
    const { contractDetails, userAccessToken, scope } = props;
    let session;

    // 1. We have an access token, try and trigger a data request
    try {
        session = await triggerDataQuery(
            {
                accessToken: userAccessToken.accessToken.value,
                contractDetails,
                scope,
            },
            sdkConfig
        );

        return { session };
    } catch (error) {
        /* Invalid tokens */
        // get and refresh
    }

    const newTokens = await refreshToken({contractDetails, userAccessToken}, sdkConfig);

    session = await triggerDataQuery(
        {
            accessToken: newTokens.accessToken.value,
            contractDetails,
            scope,
        },
        sdkConfig
    );

    return {
        session,
        updatedAccessToken: newTokens,
    };
};

const triggerDataQuery = async (props, sdkConfig) => {
    const { accessToken:access_token, contractDetails, scope } = props;
    const { contractId, privateKey, redirectUri:redirect_uri } = contractDetails;

    const jwt = createJWT(
        {
            access_token,
            client_id: `${sdkConfig.applicationId}_${contractId}`,
            redirect_uri,
        },
        privateKey
    );

    const body = await request.func.post(
        getTriggerURL,
        sdkConfig,
        {
            json: {
                scope,
           }
        },
        {
            Authorization: `Bearer ${jwt}`
        });


    const session = body?.session;
    return session;
};