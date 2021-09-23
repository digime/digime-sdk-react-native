import DeepLinking from "react-native-deep-linking";
import {Linking} from "react-native";
import {URL, URLSearchParams} from "react-native-url-polyfill";
import {removeStartingSlash} from "../utils/url";
import {AppLinkingError, TypeValidationError} from "./errors/errors";
import {addRouteCallback, appLinkingInitReturn} from "../definitions/defs";
import {isString, set, has} from "lodash";

const appLinkedRoutes = {};

/**
 * Opening the app - App was open in the background
 * @private
 * @function handleUrl
 * @param {*} obj
 */
const handleUrl = (obj) => {
	const {url} = obj;
	Linking
		.canOpenURL(url)
		.then((supported) => {
			if (supported) {
				DeepLinking.evaluateUrl(url);
			}
		});
};

/**
 * Add route to watch
 * @private
 * @function addRoute
 * @param {string} scheme
 * @param {string} route
 * @param {addRouteCallback} callback
 * @returns {addRouteReturn}
 */
const addRoute = (scheme, route, callback) => {
	if (has(appLinkedRoutes, route)) {
		return get(appLinkedRoutes, route);
	}

	// append '*' to the end of of the route
	// so that all sub domains are captured
	DeepLinking.addRoute(new RegExp(route+"/*", "g"), ({path, scheme}) => {
		const urls = new URL(scheme+path);
		const params = new URLSearchParams(urls.search);

		let searchProps = {};
		params.forEach((value, key) => {
			searchProps[key] = value;
		});

		callback(searchProps);
	});

	const newScheme = `${scheme}${removeStartingSlash(route)}`;
	set(appLinkedRoutes, route, newScheme);
	return newScheme;
};

/**
 * Remove listener to handle URL
 * @function unload
 * @private
 */
const unload = () => {
	Linking.removeEventListener("url", handleUrl);
};

/**
 * Add deep linking routes to the app.
 * Required to also configure the native app component
 * ensure the scheme references for Android and iOS are also updated
 * @example
 * // initialise and register a scheme with the SDK for deeplinks
 * // keep `addRoute` to add specific listeners
 * const {addRoute, unload} = SDK.AppLinking.init("YOUR_APP_SCHEME://");
 * @function init
 * @param {string} scheme
 * @returns {appLinkingInitReturn}
 */
export const init = (scheme) => {
	if (!isString(scheme) || scheme.length === 0) {
		throw new TypeValidationError("init `scheme` requires a valid string");
	}

	DeepLinking.addScheme(scheme);

	// there are two ways to handle the URLs to open your app;
	// 1, if the app is already open, the app is put into the foreground and a linking event is fired
	// this is handled through the addEventListener
	// 2, if the app is not already open, then the app is opened and the url is passed in as the initialURL
	// this is handed in the getInitialURL function

	// app was in the background, but already open
	Linking.addEventListener("url", handleUrl);

	// app wasn't open
	Linking
		.getInitialURL()
		.then((url) => {
			if (url) {
				Linking.openURL(url);
			}
		})
		.catch(error => {
			throw new AppLinkingError(error);
		});

	return {
		addRoute: (route, callback) => (
			addRoute(scheme, route, callback)
		),
		unload: () => {
			unload();
		}
	};
};