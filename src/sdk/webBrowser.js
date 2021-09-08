import {InAppBrowser} from "react-native-inappbrowser-reborn";
import {Linking} from "react-native";
import { ExternalBrowserError, InternalBrowserError, TypeValidationError } from "./errors/errors";
import { isString } from "lodash";


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
			await InAppBrowser.openAuth(url, BROWSER_STYLE_OPTIONS);
			return;
		}

		Linking.openURL(url);
		return;

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
		throw new ExternalBrowserError("Unable to open URL in browser");
	}

	try {
		await Linking.openURL(url);
		return;
	}
	catch (error) {
		throw new ExternalBrowserError(error);
	}
};

/**
 * Opens a URL either in an external web browser, or internal
 * defaults to using internal browser
 * @async
 * @function openUrl
 * @param {string} url
 * @param {"internal"|"external"} type
 * @returns {Promise<any>}
 */
export const openUrl = async (url, type="internal") => {
	if (!isString(url) || url.length === 0) {
		throw new TypeValidationError("OpenUrl requires a string `url` to be defined");
	}

	switch(type) {
	case "internal": {
		await openInternalBrowser(url);
		return;
	}

	case "external": {
		await openExternalBrowser(url);
		return;
	}

	default: {
		throw new TypeValidationError("Unknown browser type option");
	}
	}
};