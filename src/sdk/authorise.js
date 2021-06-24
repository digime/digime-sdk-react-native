import {hashSha256, getRandomAlphaNumeric} from './crypto';
import base64url from 'base64url';
import {request} from './request';
import {getOauthURL, getAuthURL} from '../constants/urlPaths';
import {sign, decode, verify, createJWT} from './jwt';
import {URL, URLSearchParams} from 'react-native-url-polyfill';

const generateToken = async (applicationId, contractId, privateKey, redirectUri, state) => {
    const codeVerifier = base64url(getRandomAlphaNumeric(32));

    const jwt = await createJWT(
        {
            client_id: `${applicationId}_${contractId}`,
            code_challenge: base64url(hashSha256(codeVerifier)),
            code_challenge_method: "S256",
            redirect_uri: redirectUri,
            response_mode: "query",
            response_type: "code",
            state,
        },
        privateKey
    );


    return {
        jwt,
        codeVerifier
    };
}

export const getPayloadFromToken = async (token, sdkConfig) => {
    const decodedToken = decode(token);
    return {
        code: decodedToken.payload
    };

    /*
    const jku = decodedToken?.header?.jku;
    const kid = decodedToken?.header?.kid;

    const jkuResponse = await request.direct.get(jku);

    if(!jkuResponse) {
        throw new Error("Server returned non-JWKS response");
    }

    const pem = jkuResponse
        .keys
        .filter((key) => key.kid === kid)
        .map((key) => key.pem);

    verify(token, pem[0], ["PS512"]);

    // todo: add validation.. .
    return {
        code: decodedToken.payload
    };
    */
}

const authorise = async (props, sdkConfig) => {
    const {
        contractDetails,
        state
    } = props;

    const {applicationId} = sdkConfig;

    const {
        contractId,
        privateKey,
        redirectUri
    } = contractDetails;

    const {jwt, codeVerifier} = await generateToken(
        applicationId,
        contractId,
        privateKey,
        redirectUri,
        state
    );

    const body = await request.func.post(
        getOauthURL,
        sdkConfig,
        {},
        {
            Authorization: `Bearer ${jwt}`
        });

    console.log(body)

    const {code} = await getPayloadFromToken(body?.token);

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

    const result = new URL(getAuthURL(sdkConfig.onboardUrl));
    result.search = new URLSearchParams({
        code,
        callback: props.callback,
        service: props.serviceId?.toString(),
    }).toString();

    return {
        url: result.toString(),
        codeVerifier,
        session
    }
}