import axios from "axios";


/**
 * HTTP Methods
 * @readonly
 * @enum {string}
 */
const METHOD = {
	POST: "post",
	GET: "get",
	DELETE: "delete"
};

/**
 * Calls URL with parameters. Resolves url using {@link urlProps} and {@link urlFunction} before calling {@link callUrl}
 * @async
 * @function callURLFunction
 * @param {METHOD} method
 * @param {string[]} urlProps
 * @param {function(string[]):string} urlFunction
 * @param {object} data
 * @param {object} headers
 * @param {object} [options]
 * @returns {Promise<{data,responseHeaders,status}>}
 */
const callURLFunction = async (method, urlProps, urlFunction, data, headers, options) => {
	const url = urlFunction(urlProps);
	return await callUrl(method, url, data, headers, options);
};

/**
 * Calls URL with parameters.
 * @async
 * @function callUrl
 * @param {METHOD} method
 * @param {string} url
 * @param {object} data
 * @param {object} headers
 * @param {object} [options]
 * @returns {Promise<{data,responseHeaders,status}>}
 */
const callUrl = async (method, url, data, headers, options={}) => {
	const defaultHeaders = {
		Accept:  "application/json",
	};

	headers = {
		...defaultHeaders,
		...headers,
	};

	return new Promise((resolve, reject) => {
		axios
			.request({
				method,
				url,
				data,
				headers,
				...options
			})
			.then(res => {
				const {status, data, headers: responseHeaders} = res;
				resolve({
					data,
					responseHeaders,
					status
				});
			})
			.catch(error => {
				console.log(JSON.stringify(error.response, null, 2));
				reject(error);
			});
	});
};

export const request = {
	/**
	 * Call url with given parameters directly
	 */
	direct: {
		post: (url, data, headers, options) =>
			callUrl(METHOD.POST, url, data, headers, options),
		get: (url, data, headers, options) =>
			callUrl(METHOD.GET, url, data, headers, options),
	},

	/**
	 * Call url with given parameters, using url function and url props to resolve a url
	 */
	func: {
		post: (urlFunction, urlProps, data, headers, options) =>
			callURLFunction(METHOD.POST, urlProps, urlFunction, data, headers, options),
		get: (urlFunction, urlProps, data, headers, options) =>
			callURLFunction(METHOD.GET, urlProps, urlFunction, data, headers, options),
		delete: (urlFunction, urlProps, data, headers, options) =>
			callURLFunction(METHOD.DELETE, urlProps, urlFunction, data, headers, options),
	}
};
