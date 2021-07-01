import { readFile } from "../readFile";
import { sleep } from "../utils/sleep";

const STATE = {
    PENDING: "pending",
    PARTIAL: "partial",
    COMPLETED: 'completed',
    RUNNING: 'running'
}

export const readAllFiles = async (options, sdkConfig) => {
    const { sessionKey, privateKey, onFileData, onFileError } = options;

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
            const { status, fileList } = await readFileList({ sessionKey }, sdkConfig);
            state = status.state;

            if (state === STATE.PENDING) {
                await sleep(3000);
                continue;
            }

            const newFiles = (fileList || [])
                .reduce((accumulator, file) => {
                    const { name, updatedDate } = file;

                    if (get(handledFiles, name, 0) < updatedDate) {
                        accumulator.push(name);
                        handledFiles[name] = updatedDate;
                    }
                return accumulator;
            }, []);

            const newPromises = newFiles
                .map((fileName) => {
                    return readFile({ sessionKey, fileName, privateKey }, sdkConfig)
                        .then((fileMeta) => {
                            /*
                            if (isFunction(onFileData)) {
                                onFileData({ ...fileMeta, fileList });
                            }
                            */
                            return;
                        })
                        .catch((error) => {
                            // Failed all attempts
                            /*
                            if (isFunction(onFileError)) {
                                onFileError({ error, fileName, fileList });
                            }
                            */
                            return;
                        });
            });

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