import * as JSR from 'jsrsasign';
const JWS = JSR.jws.JWS;
const {KEYUTIL} = JSR;

export const sign = (header, payload, privateKey) => {
    return new Promise((resolve, reject) => {
        try {
            const sig = JWS.sign(
                null,
                header,
                payload,
                privateKey
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