/**
 * digi.me React-Native SDK
 */

import {getSessionURL, getPrivateShareGuestURL} from './urlPaths';
import {authorise} from './authorise';
import {request} from './request';

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