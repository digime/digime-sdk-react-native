import axios from 'axios';

const callURLFunction = async (method, sdkConfig, urlFunction, data, headers) => {
    const url = urlFunction(sdkConfig?.baseUrl);
    console.log(sdkConfig)
    console.log(url)
    return await callUrl(method, url, data, headers);
}

const callUrl = async (method, url, data, headers) => {
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
        post: async (url, data, headers) => await callUrl(METHOD.POST, url, data, headers),
        get: async (url, data, headers) => await callUrl(METHOD.GET, url, data, headers),
    },
    func: {
        post: async (urlFunction, sdkConfig, data, headers) => await callURLFunction(METHOD.POST, sdkConfig, urlFunction, data, headers),
        get: async (urlFunction, sdkConfig, data, headers) => await callURLFunction(METHOD.GET, sdkConfig, urlFunction, data, headers),
    }
}
