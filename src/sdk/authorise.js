import {hashSha256, getRandomAlphaNumeric} from './crypto';
import base64url from 'base64url';
import {request} from './request';
import {getAuthURL} from './urlPaths';
import {sign, decode, verify} from './jwt';

const generateToken = async (applicationId, contractId, privateKey) => {
    const codeVerifier = base64url(getRandomAlphaNumeric(32));

    const state = "";
    const redirectUri = "https://totesfake.com"

    const jwt = await sign(
        {
            typ: "JWT",
            alg: "PS512"
        },
        {
            client_id: `${applicationId}_${contractId}`,
            code_challenge: base64url(hashSha256(codeVerifier)),
            code_challenge_method: "S256",
            nonce: getRandomAlphaNumeric(32),
            redirect_uri: redirectUri,
            response_mode: "query",
            response_type: "code",
            state,
            timestamp: new Date().getTime(),
        },
        privateKey
    );

    return {
        jwt,
        codeVerifier
    };
}

const getVerifiedJWTPayload = async (token, options) => {
    const decodedToken = decode(token);

    // todo: add validation.. .
    return decodedToken.payload;

    /*
    if (!isPlainObject(decodedToken)) {
        throw new JWTVerificationError("Unexpected JWT payload in token");
    }
    */

    const jku = decodedToken.header?.jku;
    const kid = decodedToken.header?.kid;

    /*
    if (!isString(jku) || !isString(kid)) {
        throw new JWTVerificationError("Unexpected JWT payload in token");
    }
    */

    const jkuResponse = await request.direct.get(jku, {
        responseType: "json",
        //retry: options.retryOptions,
    });

    /*
    if (!isJWKS(jkuResponse.body)) {
        throw new JWTVerificationError("Server returned non-JWKS response");
    }
    */
    const pem = jkuResponse.keys
        .filter((key) => key.kid === kid)
        .map((key) => key.pem);

    try {
        // NOTE: Casting to any as pem is unknown and this will throw anyway
        return verify(token, pem[0], ["PS512"]);
    } catch (error) {
        throw error("JWT Error")
        //throw new JWTVerificationError(get(error, "body.error.message"));
    }
};

export const authorise = async (applicationId, contractId, privateKey) => {
    const {jwt, codeVerifier} = await generateToken(applicationId, contractId, privateKey);

    return 'hello'
    const response = await request.func.post(getAuthURL, {}, {
        Authorization: `Bearer ${jwt}`
    });

    const {
        preauthorization_code:preauthorizationCode
    } = await getVerifiedJWTPayload(response?.token);

    return {
        codeVerifier,
        preauthorizationCode
    }
}