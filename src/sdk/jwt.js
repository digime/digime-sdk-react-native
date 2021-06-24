import * as JSR from 'jsrsasign';
import { getRandomAlphaNumeric } from './crypto';
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
    return new Promise((resolve, reject) => {
        try {
            const sig = JWS.sign(
                null,
                header,
                payload,
                privateKey.toString()
            );
            resolve(sig);
        }
        catch (err) {
            reject(err)
        }
    });
}

export const testSign = (pri, pub) => {
    console.log('running test')
    console.log(pri)
    const alg = 'RS256'
    const sJWS = JWS.sign(null, {alg, cty: "JWT"}, {age: 21}, pri);
    const isValid = JWS.verify(sJWS, 'digime', [alg]);

    console.log(sJWS)
    console.log(isValid)
    console.log('test complete')
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

    console.log(args)
    return JWS.verifyJWT(...args);
}