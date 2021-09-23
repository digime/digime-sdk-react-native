import {getFileURL} from "../../constants/urlPaths";
import {request} from "../http/request";
import {ReadBlob} from "../../utils/readBlob";
import {decryptData} from "../crypto";
import {decode} from "base64url";
import { DecompressionError, TypeValidationError } from "../errors/errors";
import { isNonEmptyString } from "../../utils/stringUtils";
import { sdkConfig, readFileProps, readFileResponse } from "../../definitions/defs";

import { handleServerResponse } from "../http/handleServerResponse";

/**
 * Downloads the encrypted file from the API using the name
 * and sessionKey
 * @async
 * @private
 * @function fetchFile
 * @param {{sessionKey:string, fileName:string}} props
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<{compression:string, fileContent:Uint8Array, fileMetadata:string}>}
 */
const fetchFile = async (props, sdkConfig) => {
	const {sessionKey, fileName} = props;
	const {baseUrl} = sdkConfig;

	const urlProps = {
		baseUrl,
		sessionKey,
		fileName
	};

	try {
		const {data, responseHeaders} = await request.func.get(
			getFileURL,
			urlProps,
			{},
			{
				Accept: "application/octet-stream"
			},
			{
				responseType: "blob"
			});


		const fileContent = await ReadBlob(data);
		const base64Meta = responseHeaders["x-metadata"];
		const decodedMeta = JSON.parse(decode(base64Meta));
		const {metadata: fileMetadata, compression} = decodedMeta;

		// isDecodedCAFileHeaderResponse(decodedMeta);

		return {
			compression,
			fileContent,
			fileMetadata,
		};

	} catch (error) {
		handleServerResponse(error);
	}
};

/**
 * Retrieves and decrypts a given named file from the API
 * @async
 * @function readFile
 * @param {readFileProps} props
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<readFileResponse>}
 */
export const readFile = async (props, sdkConfig) => {
	const {fileName, privateKey, sessionKey} = props;

	if (!isNonEmptyString(sessionKey)) {
		throw new TypeValidationError("Parameter sessionKey should be a non empty string");
	}

	const {compression, fileContent, fileMetadata} = await fetchFile(props, sdkConfig);

	const fileData = decryptData(privateKey, fileContent);

	if (compression) {
		throw new DecompressionError(`Compression (${compression}) not implemented`);

		/*
        if (compression === "brotli"){
            fileData = zlib.brotliDecompressSync(fileData);
        }
        else if (compression === "gzip") {
            fileData = zlib.gunzipSync(fileData);
        }
        */
	}

	return {
		fileData,
		fileMetadata,
		fileName
	};
};
