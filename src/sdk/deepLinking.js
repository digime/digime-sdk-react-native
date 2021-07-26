import DeepLinking from "react-native-deep-linking";
import {Linking} from "react-native";
import {URL, URLSearchParams} from "react-native-url-polyfill";
import { removeStartingSlash } from "../utils/url";
import { AppLinkingError } from "./errors/errors";
import "../definitions/defs";

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
 * @param {string} scheme
 * @param {string} route
 * @param {(searchParams:Object.<string, number | string>)=>void} callback
 * @returns {string}
 */
const addRoute = (scheme, route, callback) => {
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

	return `${scheme}${removeStartingSlash(route)}`;
};

/**
 * Remove listener to handle URL
 */
const unload = () => {
	Linking.removeEventListener("url", handleUrl);
};

/**
 * Add deep linking routes to the app.
 * Required to also configure the native app component
 * @function init
 * @param {string} scheme
 * @returns {{addRoute:(route:string, callback:(searchParams:Object.<string, number | string>)=>void)=>void, unload:()=>void}}
 */
export const init = (scheme) => {
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