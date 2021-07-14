import { getFileURL } from "../../constants/urlPaths";
import { request } from "../request";
import base64url from 'base64url';
import { ReadFile } from "../../utils/readFile";
import { decryptData } from "../../utils/crypto";

const fetchFile = async (props, sdkConfig) => {
    console.log('fetch file')
    console.log(props)

    const { sessionKey, fileName } = props;
    const { baseUrl } = sdkConfig;

    const urlProps = {
        baseUrl,
        sessionKey,
        fileName
    }

    try {
        const {data, responseHeaders} = await request.func.get(
            getFileURL,
            urlProps,
            {},
            {
                Accept: "application/octet-stream"
            },
            {
                responseType: 'blob'
            }
        )

        const fileContent = await ReadFile(data);
        const base64Meta = responseHeaders["x-metadata"] // as string;
        const decodedMeta = JSON.parse(base64url.decode(base64Meta));

        //isDecodedCAFileHeaderResponse(decodedMeta);

        return {
            compression: decodedMeta.compression,
            fileContent,
            fileMetadata: decodedMeta.metadata,
        };
    }
    catch (error) {
        handleServerResponse(error);
        throw error;
    }
};

export const readFile = async (props, sdkConfig) => {
    console.log('readFile')
    console.log(props)
    const {fileName, privateKey} = props;

    /*
    if (!isNonEmptyString(sessionKey)) {
        throw new TypeValidationError("Parameter sessionKey should be a non empty string");
    }
    */

    const {
        compression,
        fileContent,
        fileMetadata
    } = await fetchFile(props, sdkConfig);

   let data = decryptData(privateKey, fileContent);

   if (compression === "brotli") {
       data = zlib.brotliDecompressSync(data);
    } else if (compression === "gzip") {
        data = zlib.gunzipSync(data);
    }
    /*

    return {
        fileData: data,
        fileMetadata,
        fileName,
    };
    */
    return {
        fileData: "tbc",
        fileMetadata: 'tbc',
        fileName: 'tbc',
    };

};

