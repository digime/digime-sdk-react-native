import {getFileURL} from "../../constants/urlPaths";
import {request} from "../request";
import {ReadBlob} from "../../utils/readBlob";
import {decryptData} from "../crypto";
import {decode} from "base64url";
import { DecompressionError, TypeValidationError } from "../errors/errors";
import { isNonEmptyString } from "../../utils/stringUtils";

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
		throw error;
	}
};

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
