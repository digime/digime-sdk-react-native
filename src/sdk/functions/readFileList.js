import { getFileListURL } from "../../constants/urlPaths";
import { request } from "../request";
import "../../definitions/defs";

/**
 * Get file list from the session
 * @async
 * @function readFileList
 * @param {{sessionKey:string}} props
 * @param {sdkConfig} sdkConfig
 * @returns
 */
export const readFileList = async (props, sdkConfig) => {
	const {sessionKey} = props;
	const {baseUrl, retryOptions:{retries}} = sdkConfig;

	// TODO: check retry options
	const {data:response} = await request.func.get(
		getFileListURL,
		{
			sessionKey,
			baseUrl
		},
		{
			retries
		}
	);

	// TODO: add validalition
	// assertIsCAFileListResponse(response.body);

	return response;
};
