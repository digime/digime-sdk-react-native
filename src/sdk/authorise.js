import {hashSha256, getRandomAlphaNumeric} from './crypto';
import base64url from 'base64url';
import {request} from './request';
import {getOauthURL} from './urlPaths';
import {sign, decode, verify} from './jwt';
import {URL, URLSearchParams} from 'react-native-url-polyfill';
import {getAuthURL} from './urlPaths';

const generateToken = async (applicationId, contractId, privateKey, redirectUri, state) => {
    const codeVerifier = base64url(getRandomAlphaNumeric(32));


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
}

const authorise = async (props, sdkConfig) => {
    const {
        contractDetails,
        state
    } = props;

    const {
        contractId,
        privateKey,
        redirectUri
    } = contractDetails;

    const {jwt, codeVerifier} = await generateToken(sdkConfig.applicationId, contractId, privateKey, redirectUri, state);

    const body = await request.func.post(getOauthURL, {}, {
        Authorization: `Bearer ${jwt}`
    });

    console.log(body)

    const {
        preauthorization_code: code
    } = await getVerifiedJWTPayload(body?.token);

    const session = body?.session;

    return {
        codeVerifier,
        code,
        session
    }
}

export const getAuthorizeUrl = async (props, sdkConfig) => {
    const {
        codeVerifier,
        code,
        session
    } = await authorise(props, sdkConfig);

    console.log(sdkConfig)

    const result = new URL(getAuthURL(sdkConfig.onboardUrl));
    result.search = new URLSearchParams({
        code,
        callback: props.callback,
        service: props.serviceId?.toString(),
    }).toString();

    return {
        url: result.toString(),
        codeVerifier
    }
}