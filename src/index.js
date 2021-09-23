/**
 * digi.me React-Native SDK
 */

/**
 * @private
 */
var Buffer = require("buffer/").Buffer;

import {getAuthorizeUrl} from "./sdk/functions/authorise";
import {isPlainObject} from "lodash";
import * as NativeDeepLinking from "./sdk/deepLinking";
import * as WebBrowser from "./sdk/webBrowser";
import {getAvailableServices} from "./sdk/functions/getAvailableServices";
import {readSession} from "./sdk/functions/readSession";
import {exchangeCodeForToken} from "./sdk/functions/exchangeCode";
import {getOnboardServiceUrl} from "./sdk/functions/getOnboardServices";
import {addTrailingSlash} from "./utils/url";
import {readAllFiles} from "./sdk/functions/readAllFiles";
import {readFile} from "./sdk/functions/readFile";
import {readFileList} from "./sdk/functions/readFileList";
import {deleteUser} from "./sdk/functions/deleteUser";
import {write} from "./sdk/functions/write";
import {readAccounts} from "./sdk/functions/readAccounts";
import {sdkConfig, sdkInitReturn} from "./definitions/defs";
import { TypeValidationError } from "./sdk/errors/errors";
import { isString, has } from "lodash";

export const AppLinking = {
	...NativeDeepLinking
};

/**
 * Functions to open links from an internal
 * or external browser
 */
export const Browser = {
	...WebBrowser
};

/**
 * Initialize the SDK - returns API functions
 * @example
 * // init the sdk using just an applicationId
 * // store the returned function references for later use
 * const sdkFunctions = SDK.init({applicationId:YOUR_APPLICATION_ID});
 * @param {sdkConfig} config
 * @returns {sdkInitReturn}
 */
export const init = config => {
	config = config || {};

	if (!isPlainObject(config) || !has(config, "applicationId") || config.applicationId === null) {
		throw new TypeValidationError("SDK options should be object that contains your application Id");
	}

	if (!isString(config.applicationId) || config.applicationId.length === 0) {
		throw new TypeValidationError("Application Id cannot be an empty string");
	}

	let formatted = {
		...config
	};

	if (config.baseUrl) {
		formatted = {
			... formatted,
			baseUrl: addTrailingSlash(config.baseUrl)
		};
	}

	if (config.onboardUrl) {
		formatted = {
			... formatted,
			onboardUrl: addTrailingSlash(config.onboardUrl)
		};
	}

	// underlay defaults
	/**
	 * @type {sdkConfig}
	 */
	const sdkConfig = {
		autoRedirect: true,
		sleepPollingMS: 3000,
		baseUrl: "https://api.digi.me/v1.6/",
		onboardUrl: "https://api.digi.me/apps/saas/",
		retryOptions: {
			retries: 5
		},
		... formatted
	};

	return {
		getAuthorizeUrl: (props) => getAuthorizeUrl(props, sdkConfig),
		getOnboardServiceUrl: (props) => getOnboardServiceUrl(props, sdkConfig),
		exchangeCodeForToken: (props) => exchangeCodeForToken(props, sdkConfig),
		readSession: (props) => readSession(props, sdkConfig),
		getAvailableServices: (props) => getAvailableServices(sdkConfig, props),
		readFile: (props) => readFile(props, sdkConfig),
		readFileList: (props) => readFileList(props, sdkConfig),
		readAllFiles: (props) => readAllFiles(props, sdkConfig),
		write: (props) => write(props, sdkConfig),
		deleteUser: (props) => deleteUser(props, sdkConfig),
		readAccounts: (props) => readAccounts(props, sdkConfig)
	};
};
