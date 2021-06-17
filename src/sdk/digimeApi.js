/**
 * digi.me React-Native SDK
 */

import {getSessionURL, getPrivateShareGuestURL} from './urlPaths';
import {authorise} from './authorise';
import {request} from './request';

const authOngoingOnce = async (applicationID, contractID, privateKey) => {
    return await authorise(applicationID, contractID, privateKey);
}

const establishSession = async (appID, contractID) => {
    return await request.func.post(getSessionURL, {appID, contractID});
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