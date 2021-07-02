import { getFileListURL } from "../../constants/urlPaths";
import { request } from "../request";

export const readFileList = async (props, sdkConfig) => {
    const {sessionKey} = props;
    const {baseUrl} = sdkConfig;

    // TODO: check retry options
    const {data:response} = await request.func.get(
        getFileListURL,
        {
            sessionKey,
            baseUrl
        }
    )

    // TODO: add validalition
    // assertIsCAFileListResponse(response.body);

    return response;
};
