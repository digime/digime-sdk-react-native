/**
 * digi.me React-Native SDK
 */
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import {getSessionURL, getPrivateShareGuestURL} from './src/sdk/urlPaths';
import {getAuthorizeUrl} from './src/sdk/authorise';
import {request} from './src/sdk/request';

const authOngoingOnce = async ({applicationID: appID, contractID, privateKey}) => {
    return await authorise(appID, contractID, privateKey);
}

export const establishSession = async ({applicationID: appId, contractID: contractId}) => {
    return await request.func.post(getSessionURL, {appId, contractId});
}

const guestShareURL = ({sessionKey, callbackUrl}) => {
    const baseurl = "https://api.digi.me"; // temp
    return getPrivateShareGuestURL(baseurl, sessionKey, callbackUrl)
}

const auth = {
    ongoing: {
        once: authOngoingOnce
    },
    once: {
        guestURL: guestShareURL
    }
}

/*
export {
    establishSession,
    auth
}
*/

// implement this
const addTrailingSlash = string => string;

export const init = config => {
    config = config || {};

    const formatted = {
        ...config,
        baseUrl: addTrailingSlash(config.baseUrl),
        onboardUrl: addTrailingSlash(config.onboardUrl),
    };

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
        getAvailableServices: (contractID) => (
            getAvailableServices(sdkConfig, contractID)
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
