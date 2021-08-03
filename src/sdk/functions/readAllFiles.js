import { readFile } from "../functions/readFile";
import { sleep } from "../../utils/sleep";
import { readFileList } from "./readFileList";
import { get, isFunction } from "lodash";
import { isNonEmptyString } from "../../utils/stringUtils";
import { TypeValidationError } from "../errors/errors";
import { sdkConfig, readAllFilesProps, readAllFilesResponse } from "../../definitions/defs";

/**
 * Sync states from the API
 * @readonly
 * @enum {string}
 */
const STATE = {
	PENDING: "pending",
	PARTIAL: "partial",
	COMPLETED: "completed",
	RUNNING: "running"
};

/**
 * Retrieves and decrypts all files from the API
 * @function readAllFiles
 * @param {readAllFilesProps} props
 * @param {sdkConfig} sdkConfig
 * @returns {readAllFilesResponse}
 */
export const readAllFiles = (props, sdkConfig) => {
	const { sessionKey, onFileData, onFileError } = props;

	if (!isNonEmptyString(sessionKey)) {
		throw new TypeValidationError("Parameter sessionKey should be a non empty string");
	}

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
				await sleep(sdkConfig.sleepPollingMS);
				continue;
			}

			// todo = what's the purpose of this?
			const newFiles = fileList
				.reduce((accumulator, file) => {
					const { name, updatedDate } = file;

					if (get(handledFiles, name, 0) < updatedDate) {
						accumulator.push(name);
						handledFiles[name] = updatedDate;
					}

					return accumulator;
				}, []);

			const newPromises = newFiles
				.map(async (fileName) => {
					try {
						const fileContents = await readFile({fileName, ...props}, sdkConfig);
						if (isFunction(onFileData)) {
							onFileData({ ...fileContents, fileList });
						}
					}
					catch(error) {
						// Failed all attempts
						if (isFunction(onFileError)) {
							onFileError({ error, fileName, fileList });
						}
					}
					return;
				});

			filePromises.push(...newPromises);

			if (state === STATE.RUNNING) {
				await sleep(sdkConfig.sleepPollingMS);
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