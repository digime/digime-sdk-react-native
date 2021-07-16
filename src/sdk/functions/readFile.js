import {getFileURL} from "../../constants/urlPaths";
import {request} from "../request";
import {ReadBlob} from "../../utils/readBlob";
import {decryptData} from "../../utils/crypto";
import {decode} from 'base64url'

const fetchFile = async (props, sdkConfig) => {
    const {sessionKey, fileName} = props;
    const {baseUrl} = sdkConfig;

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
            })


        const fileContent = await ReadBlob(data);
        const base64Meta = responseHeaders["x-metadata"]
        console.log({base64Meta})
        const decodedMeta = JSON.parse(decode(base64Meta));

        const {metadata: fileMetadata, compression} = decodedMeta;

        // isDecodedCAFileHeaderResponse(decodedMeta);

        return {
            compression,
            fileContent,
            fileMetadata,
        };

    } catch (error) {
        // TODO: Add error
        console.log(error)
        handleServerResponse(error);
        throw error;
    }
};

export const readFile = async (props, sdkConfig) => {
    const {fileName, privateKey} = props;

    /*
    if (!isNonEmptyString(sessionKey)) {
        throw new TypeValidationError("Parameter sessionKey should be a non empty string");
    }
    */

    const {compression, fileContent, fileMetadata} = await fetchFile(props, sdkConfig);

    let fileData = decryptData(privateKey, fileContent);

    if (compression) {
        throw new Error("Compression not supported")

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
