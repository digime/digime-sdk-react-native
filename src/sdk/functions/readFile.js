import { getFileURL } from "../../constants/urlPaths";
import { request } from "../request";
import base64url from 'base64url';

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
        const {data:fileContent, responseHeaders} = await request.func.get(
            getFileURL,
            urlProps,
            {
                responseType: "buffer"
            },
            {
                Accept: "application/octet-stream"
            }
        )

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

    console.log({
        compression,
        fileContent,
        fileMetadata
    })

    /*

    const key = new NodeRSA(privateKey, "pkcs1-private-pem");
    let data = decryptData(key, fileContent);

    if (compression === "brotli") {
        data = zlib.brotliDecompressSync(data);
    } else if (compression === "gzip") {
        data = zlib.gunzipSync(data);
    }

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

