/**
 * digi.me React-Native SDK
 */
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import {getSessionURL, getPrivateShareGuestURL} from './src/sdk/urlPaths';
import {authorise} from './src/sdk/authorise';
import {request} from './src/sdk/request';

const authOngoingOnce = async ({applicationId: appId, contractId, privateKey}) => {
    return await authorise(appId, contractId, privateKey);
}

const establishSession = async ({applicationId: appId, contractId}) => {
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

export {
    establishSession,
    auth
}
