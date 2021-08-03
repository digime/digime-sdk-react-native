import { getUserURL } from "../../constants/urlPaths";
import { createJWT } from "../jwt";
import { request } from "../http/request";

import { getAuthHeader } from "../../utils/url";
import { handleServerResponse } from "../http/handleServerResponse";
import { sdkConfig, deleteUserProps, deleteUserResponse } from "../../definitions/defs";

/**
 * Remove a user from digi.me
 * @async
 * @function deleteUser
 * @param {deleteUserProps} props
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<deleteUserResponse>}
 */
export const deleteUser = async (props, sdkConfig) => {
	const { userAccessToken, contractDetails } = props;
	const { contractId, privateKey, redirectUri:redirect_uri } = contractDetails;
	const {applicationId, baseUrl} = sdkConfig;
	const {accessToken} = userAccessToken;

	const jwt = await createJWT(
		{
			access_token: accessToken.value,
			redirect_uri
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
				baseUrl
			},
			{
				...getAuthHeader(jwt)
			}
		);

		return {
			deleted: true,
			response,
		};
	} catch (error) {
		handleServerResponse(error);
	}
};