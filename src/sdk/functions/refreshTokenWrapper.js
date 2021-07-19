import { refreshToken } from "./refreshTokens";

export const refreshTokenWrapper = async(operationFn, props, sdkConfig) => {
	try {
		return await operationFn(props, sdkConfig);
	} catch (error) {
		// TODO: handle the status errors
		/*
        if (!(error instanceof HTTPError)) {
            throw error;
        }

        if (error.response.statusCode !== 401) {
            handleServerResponse(error);
            throw error;
        }
        */
	}

	const {contractDetails, userAccessToken} = props;

	const newTokens = await refreshToken({
		contractDetails,
		userAccessToken
	},
	sdkConfig
	);

	return await operationFn(
		{
			...props,
			userAccessToken: newTokens,
		},
		sdkConfig
	);
};