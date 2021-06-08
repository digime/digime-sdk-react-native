/**
 * digi.me React-Native SDK
 */
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import {getSessionURL, getPrivateShareGuestURL} from './src/sdk/urlPaths';
import {authorise} from './src/sdk/authorise';
import {request} from './src/sdk/request';

const authOngoingOnce = async (applicationId, contractId, privateKey) => {
    return await authorise(applicationId, contractId, privateKey);
}

const establishSession = async (appId, contractId) => {
    return await request.func.post(getSessionURL, {appId, contractId});
}

const guestShareURL = (sessionKey, callbackUrl) => {
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

export {
    establishSession,
    auth
}
