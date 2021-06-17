import {hashSha256, getRandomAlphaNumeric} from './crypto';
import base64url from 'base64url';
import {request} from './request';
import {getAuthURL} from './urlPaths';
import {sign, decode, verify} from './jwt';

const generateToken = async (applicationID, contractID, privateKey, redirectUri, state) => {
    const codeVerifier = base64url(getRandomAlphaNumeric(32));


    const jwt = await sign(
        {
            typ: "JWT",
            alg: "PS512"
        },
        {
            client_id: `${applicationID}_${contractID}`,
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
}

const authorise = async (contractDetails, sdkConfig) => {
    const {contractID, privateKey, redirectUri} = contractDetails;
    const state = "";

    const {jwt, codeVerifier} = await generateToken(sdkConfig.applicationID, contractID, privateKey, redirectUri, state);

    const body = await request.func.post(getAuthURL, {}, {
        Authorization: `Bearer ${jwt}`
    });

    const {
        preauthorization_code: code
    } = await getVerifiedJWTPayload(body?.token);

    return {
        codeVerifier,
        code
    }
}

export const getAuthorizeUrl = async (props, sdkConfig) => {
    const auth = await authorise(props, sdkConfig);
    return {

    }
}