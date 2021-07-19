export const addTrailingSlash = url => {
	if (url.slice(-1) != "/") {
		return url+"/";
	}
	return url;
};

export const getAuthHeader = jwt => {
	return {
		Authorization: `Bearer ${jwt}`
	};
};

export const removeStartingSlash = url => {
	url = url || "";

	if (url.slice(0,1) === "/") {
		return url.slice(1);
	}
	return url;
};