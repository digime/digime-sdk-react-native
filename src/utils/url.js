export const addTrailingSlash = url => {
    if (url.slice(-1) != '/') {
        return url+'/';
    }
    return url;
};

export const getAuthHeader = jwt => {
    return {
        Authorization: `Bearer ${jwt}`
    }
}