/**
 * digi.me React-Native SDK
 */
import {Buffer} from "buffer";
global.Buffer = Buffer;

import {getAuthorizeUrl} from "./sdk/functions/authorise";
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

/**
 * Functions to handle deep linking
 */
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
 * Initialize the SDK
 * @param {sdkConfig} config
 * @returns {sdkInitReturn}
 */
export const init = config => {
	config = config || {};

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

		// TODO: validate functions below
		write: (props) => write(props, sdkConfig),
		deleteUser: (props) => deleteUser(props, sdkConfig),
		readAccounts: (props) => readAccounts(props, sdkConfig)
	};
};
