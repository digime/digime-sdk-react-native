/**
 * digi.me React-Native SDK
 */
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import {getSessionURL} from './src/constants/urlPaths';
import {getAuthorizeUrl} from './src/sdk/authorise';
import {request} from './src/sdk/request';
import * as DL from './src/sdk/deepLinking';

const authOngoingOnce = async ({applicationId: appId, contractId, privateKey}) => {
    return await authorise(appId, contractId, privateKey);
}

export const establishSession = async ({applicationId: appId, contractId, baseUrl}) => {
    return await request.func.post(getSessionURL, {baseUrl}, {appId, contractId});
}

const addTrailingSlash = url => {
    if (url.slice(-1) != '/') {
        return url+'/';
    }
    return url;
};

export const deeplinking = {
    init: DL.init,
    unload: DL.unload,
    addRoute: DL.addRoute,
    openUrl: DL.openUrl
}

export const init = config => {
    config = config || {};

    let formatted = {
        ...config,
    };

    if (config.baseUrl) {
        formatted = {
            ...formatted,
            baseUrl: addTrailingSlash(config.baseUrl),
        }
    }

    if (config.onboardUrl) {
        formatted = {
            ...formatted,
            onboardUrl: addTrailingSlash(config.onboardUrl),
        }
    }

    // overlay defaults
    const sdkConfig = {
        baseUrl: "https://api.digi.me/v1.6/",
        onboardUrl: "https://api.digi.me/apps/saas/",
        retryOptions: {
            retries: 5,
        },
        ...formatted,
    };

    return {
        getAuthorizeUrl: (props) => (
            getAuthorizeUrl(props, sdkConfig)
        ),
        getOnboardServiceUrl: (props) => (
            getOnboardServiceUrl(props, sdkConfig)
        ),
        exchangeCodeForToken: (props) => (
            exchangeCodeForToken(props, sdkConfig)
        ),
        write: (props) => (
            write(props, sdkConfig)
        ),
        readSession: (props) => (
            readSession(props, sdkConfig)
        ),
        deleteUser: (props) => (
            deleteUser(props, sdkConfig)
        ),
        getAvailableServices: (contractId) => (
            getAvailableServices(sdkConfig, contractId)
        ),
        readFile: (props) => (
            readFile(props, sdkConfig)
        ),
        readFileList: (props) => (
            readFileList(props, sdkConfig)
        ),
        readAllFiles: (props) => (
            readAllFiles(props, sdkConfig)
        ),
        readAccounts: (props) => (
            readAccounts(props, sdkConfig)
        ),
    }

}
