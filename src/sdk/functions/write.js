
import {encryptData} from "../crypto";
import { createJWT } from "../jwt";
import { request } from "../request";
import "../../definitions/defs";
import { TypeValidationError } from "../errors/errors";
import {refreshToken} from "./refreshTokens";

/**
 *
 * @param {{contractDetails:contractDetails, userAccessToken:string, data:string, publicKey:string, postboxId:string}} props
 * @param {sdkConfig} sdkConfig
 * @returns
 */
export const write = async (props, sdkConfig) => {
	if (!WriteOptionsCodec.is(props)) {
		// tslint:disable-next-line:max-line-length
		throw new TypeValidationError(
			"Parameters failed validation. props should be a plain object that contains the properties contractDetails, userAccessToken, postboxId, publicKey and data."
		);
	}

	const { contractDetails, userAccessToken, data, publicKey, postboxId } = props;

	if (!areNonEmptyStrings([publicKey, postboxId])) {
		// tslint:disable-next-line:max-line-length
		throw new TypeValidationError(
			"pushDataToPostbox requires the following properties to be set: postboxId, publicKey, sessionKey"
		);
	}

	// TODO: add this function below
	// assertIsPushedFileMeta(data);

	// We have an access token, try and trigger a push request
	const result = await triggerPush(
		{
			accessToken: userAccessToken?.accessToken.value,
			contractDetails,
			data,
			publicKey,
			postboxId,
		},
		sdkConfig
	);

	// If an access token was provided and the status is pending, it means the access token may have expired.
	if (result.status === "pending") {
		const newTokens = await refreshToken({ contractDetails, userAccessToken }, sdkConfig);
		const secondPushResult = await triggerPush(
			{
				accessToken: newTokens.accessToken.value,
				contractDetails,
				data,
				publicKey,
				postboxId,
			},
			sdkConfig
		);

		return {
			...secondPushResult,
			userAccessToken: newTokens,
		};
	}

	return {
		...result,
		userAccessToken,
	};
};

/**
 * @param {{accessToken:string, contractDetails:contractDetails, postboxId:string, publicKey:string, data:string, accessToken?:string}} props
 * @param {sdkConfig} sdkConfig
 * @returns
 */
const triggerPush = async (props, sdkConfig) => {
	const { accessToken: access_token, contractDetails, postboxId, publicKey, data } = props;
	const { contractId, privateKey, redirectUri:redirect_uri } = contractDetails;
	const {fileDescriptor, fileName} = data;
	const {baseUrl} = sdkConfig;

	const {
		encryptedKey,
		iv,
		encryptedMeta
	} = encryptData(publicKey, privateKey, fileDescriptor);


	const form = new FormData();
	form.append("file", encryptedData, fileName);

	const jwt = await createJWT(
		{
			access_token,
			iv,
			metadata: encryptedMeta.toString("base64"),
			redirect_uri,
			symmetrical_key: encryptedKey.toString("base64"),
		},
		{
			applicationId,
			contractId,
		},
		privateKey
	);

	try {

		const urlProps = {
			baseUrl, postboxId
		};

		const { body } = await request.func.post(
			getPostboxURL,
			urlProps,
			{
				form
			},
			{
				contentType: "multipart/form-data",
				...getAuthHeader(jwt)
			},
			{
				retry: sdkConfig.retryOptions,
				responseType: "json",
			});

		assertIsPushDataStatusResponse(body);
		return body;
	} catch (error) {
		handleServerResponse(error);
		throw error;
	}
};