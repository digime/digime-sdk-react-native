
import {encryptData} from "../crypto";
import { createJWT } from "../jwt";
import { request } from "../request";
import "../../definitions/defs";

/*
interface WriteOptions {
    contractDetails: ContractDetails;
    userAccessToken: UserAccessToken;
    data: FileMeta;
    publicKey: string;
    postboxId: string;
}

export const WriteOptionsCodec: t.Type<WriteOptions> = t.type({
    contractDetails: ContractDetailsCodec,
    userAccessToken: UserAccessTokenCodec,
    postboxId: t.string,
    publicKey: t.string,
    data: PushedFileMetaCodec,
});

export interface FileMeta {
    fileData: Buffer;
    fileName: string;
    fileDescriptor: {
        mimeType: string;
        accounts: Array<{
            accountId: string;
        }>;
        reference?: string[];
        tags?: string[];
    };
}

interface WriteResponse extends WriteDataAPIResponse {
    userAccessToken: UserAccessToken;
}

export const write = async (options, sdkConfig) => {
    if (!WriteOptionsCodec.is(options)) {
        // tslint:disable-next-line:max-line-length
        throw new TypeValidationError(
            "Parameters failed validation. props should be a plain object that contains the properties contractDetails, userAccessToken, postboxId, publicKey and data."
        );
    }

    const { contractDetails, userAccessToken, data, publicKey, postboxId } = options;

    if (!areNonEmptyStrings([publicKey, postboxId])) {
        // tslint:disable-next-line:max-line-length
        throw new TypeValidationError(
            "pushDataToPostbox requires the following properties to be set: postboxId, publicKey, sessionKey"
        );
    }

    assertIsPushedFileMeta(data);

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
        const newTokens: UserAccessToken = await refreshToken({ contractDetails, userAccessToken }, sdkConfig);
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
*/

/**
 * for testing, making a direct export
 * @param {} props
 * @param {sdkConfig} sdkConfig
 * @returns
 */
const triggerPush = async (props, sdkConfig) => {
	const { accessToken, contractDetails, postboxId, publicKey, data } = props;
	const { contractId, privateKey, redirectUri } = contractDetails;
	const {fileDescriptor, fileName} = data;
	const {baseUrl} = sdkConfig;

	const {
		encryptedKey,
		iv,
		encryptedMeta
	} = encryptData(publicKey, privateKey, fileDescriptor);

	return;

	const form = new FormData();
	form.append("file", encryptedData, fileName);

	const jwt = await createJWT(
		{
			...(accessToken && { access_token: accessToken }),
			iv,
			metadata: encryptedMeta.toString("base64"),
			redirect_uri: redirectUri,
			symmetrical_key: encryptedKey.toString("base64"),
		},
		{
			applicationId,
			contractId,
		},
		privateKey
	);

	return;

	try {

		const urlProps = {
			baseUrl,postboxId
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