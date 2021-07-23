import "../definitions/defs";

/**
 * Adds slash to end of url (if required)
 * @param {string} url
 * @returns {string} result
 *
 * @example
 * addTrailingSlash("https://digi.me")
 */
export const addTrailingSlash = url => {
	if (url.slice(-1) != "/") {
		return url+"/";
	}
	return url;
};

/**
 * Gets Key/Value pair for auth header for JWT auth request
 * @param {string} jwt
 * @returns {Object}
 */
export const getAuthHeader = jwt => {
	return {
		Authorization: `Bearer ${jwt}`
	};
};

/**
 *
 * @param {string} url
 * @returns {string}
 *
 * @example remoteStartingSlash("/test")
 */
export const removeStartingSlash = url => {
	url = url || "";

	if (url.slice(0,1) === "/") {
		return url.slice(1);
	}
	return url;
};