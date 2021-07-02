import axios from 'axios';

const callURLFunction = async (method, urlProps, urlFunction, data, headers) => {
    const url = urlFunction(urlProps);
    return await callUrl(method, url, data, headers);
}

const callUrl = async (method, url, data, headers) => {
    const defaultHeaders = {
        Accept:  "application/json"
    }

    headers = {
        ...defaultHeaders,
        ...headers,
    }

    return new Promise((resolve, reject) => {
        axios
            .request({
                method,
                url,
                data,
                headers
            })
            .then(res => {
                const {data} = res;
                console.log("status: ", res.status)
                console.log(JSON.stringify(res, null, 4))
                resolve(data)
            })
            .catch(error => {
                console.log(JSON.stringify(error.response, null, 2))
                reject('have error')
            })
    })
}

const METHOD = {
    POST: "post",
    GET: "get"
}

export const request = {
    direct: {
        post: (url, data, headers) =>
            callUrl(METHOD.POST, url, data, headers),
        get: (url, data, headers) =>
            callUrl(METHOD.GET, url, data, headers),
    },
    func: {
        post: (urlFunction, urlProps, data, headers) =>
            callURLFunction(METHOD.POST, urlProps, urlFunction, data, headers),
        get: (urlFunction, urlProps, data, headers) =>
            callURLFunction(METHOD.GET, urlProps, urlFunction, data, headers),
    }
}
