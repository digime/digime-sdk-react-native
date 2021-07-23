import axios from "axios";
import "../definitions/defs";

const callURLFunction = async (method, urlProps, urlFunction, data, headers, options) => {
	const url = urlFunction(urlProps);
	return await callUrl(method, url, data, headers, options);
};

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

/**
 * HTTP Methods
 */
const METHOD = {
	POST: "post",
	GET: "get"
};

export const request = {
	direct: {
		post: (url, data, headers, options) =>
			callUrl(METHOD.POST, url, data, headers, options),
		get: (url, data, headers, options) =>
			callUrl(METHOD.GET, url, data, headers, options),
	},
	func: {
		post: (urlFunction, urlProps, data, headers, options) =>
			callURLFunction(METHOD.POST, urlProps, urlFunction, data, headers, options),
		get: (urlFunction, urlProps, data, headers, options) =>
			callURLFunction(METHOD.GET, urlProps, urlFunction, data, headers, options),
	}
};
