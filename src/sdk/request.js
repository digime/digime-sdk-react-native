import axios from 'axios';

const callURLFunction = async (method, urlFunction, data, headers) => {
    const sdkOptions = {
        baseUrl: "https://api.digi.me/v1.5",
        retryOptions: {
            retries: 5,
        },
        //...options,
    };

    const sdkVersion = "4.0.0";

    const sdkAgent = {
        name: "js",
        version: sdkVersion,
        meta: {
            node: process.version,
        },
    };
    const defaultData = {
        sdkAgent,
        accept: {
            compression: "gzip",
        }

        //responseType: "json",
        //retry: sdkOptions.retryOptions,
    }

    const url = urlFunction(sdkOptions.baseUrl);
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
                resolve(data)
            })
            .catch(error => {
                //console.log(JSON.stringify(error.response, null, 2))
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
        post: async (urlFunction, data, headers) => await callURLFunction(METHOD.POST, urlFunction, data, headers),
        get: async (urlFunction, data, headers) => await callURLFunction(METHOD.GET, urlFunction, data, headers),
    }
}
