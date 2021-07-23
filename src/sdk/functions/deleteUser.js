import { getUserURL } from "../../constants/urlPaths";
import { createJWT } from "../jwt";
import { request } from "../request";

import { getAuthHeader } from "../../utils/url";

/**
 * Remove a user from digi.me
 * @async
 * @function deleteUser
 * @param {{ userAccessToken:string, contractDetails:contractDetails }} props
 * @param {sdkConfig} sdkConfig
 * @returns {{deleted:Boolean, response}}
 */
export const deleteUser = async (props, sdkConfig) => {
    const { userAccessToken, contractDetails } = props;
    const { contractId, privateKey, redirectUri } = contractDetails;

    const jwt = await createJWT(
        {
            access_token: userAccessToken.accessToken.value,
            redirect_uri: redirectUri
        },
        {
            applicationId,
            contractId
        },
        privateKey
    );

    try {
        const response = await request.func.delete(
            getUserURL,
            {
                baseUrl: sdkConfig.baseUrl
            },
            {
                getAuthHeader(jwt)
            }
        );

        return {
            deleted: true,
            response,
        };
    } catch (error) {
        handleServerResponse(error);
        throw error;
    }
};