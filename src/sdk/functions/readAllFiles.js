import { readFile } from "../functions/readFile";
import { sleep } from "../../utils/sleep";
import { readFileList } from "./readFileList";
import { get } from "lodash";

const STATE = {
    PENDING: "pending",
    PARTIAL: "partial",
    COMPLETED: 'completed',
    RUNNING: 'running'
}

export const readAllFiles = async (props, sdkConfig) => {
    const { sessionKey, privateKey, onFileData, onFileError } = props;

    // TODO: add validation
    /*
    if (!isNonEmptyString(sessionKey)) {
        throw new TypeValidationError("Parameter sessionKey should be a non empty string");
    }
    */

    let allowPollingToContinue = true;

    // eslint-disable-next-line no-async-promise-executor
    const allFilesPromise = new Promise(async (resolve) => {
        const filePromises = [];
        const handledFiles = {};
        let state = STATE.PENDING;

        while (allowPollingToContinue && state !== STATE.PARTIAL && state !== STATE.COMPLETED) {
            const {status, fileList=[]} = await readFileList(props, sdkConfig);
            state = status.state;

            if (state === STATE.PENDING) {
                await sleep(3000);
                continue;
            }


            // todo = what's the purpose of this?
            const newFiles = fileList
                .reduce((accumulator, file) => {
                    const { name, updatedDate } = file;

                    console.log("H files")
                    console.log(handledFiles)
                    console.log(file)
                    if (get(handledFiles, name, 0) < updatedDate) {
                        accumulator.push(name);
                        handledFiles[name] = updatedDate;
                    }
                return accumulator;
            }, []);

            const newPromises = newFiles
                .map(async (fileName) => {
                    try {
                        const fileMeta = await readFile({fileName, ...props}, sdkConfig);



                            //if (isFunction(onFileData)) {
                                onFileData({ ...fileMeta, fileList });
                            //}
                    }
                    catch(error) {
                            // Failed all attempts
                            ///*
                            //if (isFunction(onFileError)) {
                                onFileError({ error, fileName, fileList });
                            //}
                            //*/
                    }
                    return;
                })

            filePromises.push(...newPromises);

            if (state === STATE.RUNNING) {
                await sleep(3000);
            }
        }

        Promise
            .all(filePromises)
            .then(() => {
                resolve();
            });
    });

    return {
        stopPolling: () => {
            allowPollingToContinue = false;
        },
        filePromise: allFilesPromise,
    };
};