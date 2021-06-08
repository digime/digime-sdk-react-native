
import * as JSR from 'jsrsasign';

const JWS = JSR.jws.JWS;

export const sign = (header, payload, key) => {
    return new Promise((res, rej) => {
        const sig = JWS.sign(
            null,
            header,
            payload,
            key
        );
        res(sig)
    });
}

export const decode = (token) => {
    const asoArray = JWS.parse(token);

    return {
        header: asoArray?.headerObj,
        payload: asoArray?.payloadObj
    }
}

export const verify = (signature, key, algorithm) => {
    return JWS.verify(algorithm, key, signature)
}