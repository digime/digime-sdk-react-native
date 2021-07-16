import JSR from 'jsrsasign';
import { getRandomAlphaNumeric } from '../utils/hash';
import { ServerError } from './errors/errors';
const JWS = JSR.jws.JWS;

export const createJWT = async (payload, privateKey) => {
    payload = {
        nonce: getRandomAlphaNumeric(32),
        timestamp: new Date().getTime(),
        ...payload
    };

    const header = {
        typ: "JWT",
        alg: "PS512"
    };

    return await sign(
        header,
        payload,
        privateKey
    )
};

const sign = (header, payload, privateKey) => {
    return new Promise((resolve) => {
        try {
            const sig = JWS.sign(
                null,
                header,
                payload,
                privateKey.toString()
            );
            resolve(sig);
        }
        catch (error) {
            // todo handle server response
            throw new ServerError(error)
        }
    });
}

export const decode = (token) => {
    const asoArray = JWS.parse(token);

    return {
        header: asoArray?.headerObj,
        payload: asoArray?.payloadObj,
        signature: asoArray?.sigHex
    }
}

export const verify = (signature, key, alg) => {
    const args = (
        signature,
        key,
        {
            alg
        }
    )

    return JWS.verifyJWT(...args);
}