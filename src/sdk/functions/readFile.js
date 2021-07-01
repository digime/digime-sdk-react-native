import { getFileURL } from "../../constants/urlPaths";
import { request } from "../request";

const fetchFile = async (props, sdkConfig) => {
    const { sessionKey, fileName } = props;

    let response;

    const {baseUrl} = sdkConfig;

    const urlProps = {
        baseUrl,
        sessionKey,
        fileName
    }

    try {
        response = await request.func.get(
            getFileURL,
            urlProps,
            {
                responseType: "buffer"
            }
        )
    } catch (error) {
        handleServerResponse(error);
        throw error;
    }

    /*
    const fileContent: Buffer = response.body as Buffer;
    const base64Meta: string = response.headers["x-metadata"] as string;
    const decodedMeta: any = JSON.parse(base64url.decode(base64Meta));

    isDecodedCAFileHeaderResponse(decodedMeta);

    return {
        compression: decodedMeta.compression,
        fileContent,
        fileMetadata: decodedMeta.metadata,
    };
    */

    return {
        compression: "tbc",
        fileContent: 'tbc',
        fileMetadata: 'tbc'
    };
};

export const readFile = async (props, sdkConfig) => {
    const {fileName, privateKey } = props;

    /*
    if (!isNonEmptyString(sessionKey)) {
        throw new TypeValidationError("Parameter sessionKey should be a non empty string");
    }
    */

    const response = await fetchFile(props, sdkConfig);
    const { compression, fileContent, fileMetadata } = response;

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

