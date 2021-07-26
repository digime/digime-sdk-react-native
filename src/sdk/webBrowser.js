import {InAppBrowser} from "react-native-inappbrowser-reborn";
import {Linking} from "react-native";
import { ExternalBrowserError, InternalBrowserError } from "./errors/errors";
import "../definitions/defs";

const getIosOptions = {
	// iOS Properties
	dismissButtonStyle: "cancel",
	preferredBarTintColor: "#453AA4",
	preferredControlTintColor: "white",
	readerMode: false,
	animated: true,
	modalPresentationStyle: "fullScreen",
	modalTransitionStyle: "coverVertical",
	modalEnabled: true,
	enableBarCollapsing: false,
};

const getAndroidOptions = {
	// Android Properties
	showTitle: true,

	//toolbarColor: '#6200EE',
	//secondaryToolbarColor: 'black',
	//navigationBarColor: 'black',
	//navigationBarDividerColor: 'white',
	enableUrlBarHiding: true,
	enableDefaultShare: false,
	forceCloseOnRedirection: false,
	showInRecents: false,
	hasBackButton: false,


	// Specify full animation resource identifier(package:anim/name)
	// or only resource name(in case of animation bundled with app).
	animations: {
		startEnter: "slide_in_right",
		startExit: "slide_out_left",
		endEnter: "slide_in_left",
		endExit: "slide_out_right"
	},
	headers: {}
};

const BROWSER_STYLE_OPTIONS = {
	...getIosOptions,
	...getAndroidOptions
};

/**
 * Open url in app-internal webview
 * using custom chrome tabs
 * @async
 * @function openInternalBrowser
 * @param {string} url
 * @returns
 */
const openInternalBrowser = async (url) => {
	try {
		if (await InAppBrowser.isAvailable()) {
			// TODO check iOS behaviour
			return await InAppBrowser.openAuth(url, BROWSER_STYLE_OPTIONS);
		} else {
			Linking.openURL(url);
		}
	} catch (error) {
		throw new InternalBrowserError(error);
	}
};

/**
 * Open url in external browser app
 * @async
 * @function openExternalBrowser
 * @param {string} url
 * @returns
 */
const openExternalBrowser = async (url) => {
	const canOpen = await Linking.canOpenURL(url);

	if (!canOpen) {
		return false;
	}

	try {
		return await Linking.openURL(url);
	}
	catch (error) {
		throw new ExternalBrowserError(error);
	}
};

/**
 * @typedef {Object} BrowserType
 */

/**
 * Open browser behaviour to use
 * @readonly
 * @enum {string}
 */
const BROWSER_TYPE = {
	/** Open a web browser for URL calls within the app */
	INTERNAL: "internal",

	/** Opens the url using an external web browser app on the device */
	EXTERNAL: "external",
};

/**
 * Opens a URL either in an external web browser, or internal
 * defaults to using internal browser
 * @async
 * @function openUrl
 * @param {string} url
 * @param {BrowserType} type
 * @returns {Promise<any>}
 */
export const openUrl = async (url, type=BROWSER_TYPE.INTERNAL) => {
	if (type === BROWSER_TYPE.INTERNAL) {
		return await openInternalBrowser(url);
	}

	if (type === BROWSER_TYPE.EXTERNAL) {
		return openExternalBrowser(url);
	}
};