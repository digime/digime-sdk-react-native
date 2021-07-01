import {hashSha256, getRandomAlphaNumeric} from '../../utils/crypto';
import base64url from 'base64url';
import {request} from '../request';
import {getOauthURL, getAuthURL} from '../../constants/urlPaths';
import {sign, decode, verify, createJWT} from '../jwt';
import {URL, URLSearchParams} from 'react-native-url-polyfill';
import { getAuthHeader } from '../../utils/url';

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

const getParam = (obj, name) => {
    const {
        [name]: {
            expires_on: expires,
            value,
        }
    } = obj;
    return {
        expires,
        value
    };
  }

export const getPayloadFromToken = async (token, sdkConfig) => {
    const {
        payload,
        header
    } = decode(token);

    console.log(payload)

    return {
        ...payload
    };

    /*
    // TODO: Add token validation from response
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
        state,
        scope
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
        {
            actions: {
                pull: {
                    scope,
                }
            }
        },
        {
            ...getAuthHeader(jwt)
        });

    console.log(body)

    const {
        preauthorization_code: code
    } = await getPayloadFromToken(body?.token, sdkConfig);

    const session = body?.session;

    return {
        codeVerifier,
        code,
        session
    }
}

export const getAuthorizeUrl = async (props, sdkConfig) => {
    const {autoRedirect, onboardUrl} = sdkConfig;
    const {
        codeVerifier,
        code,
        session,
    } = await authorise(props, sdkConfig);

    const result = new URL(getAuthURL({baseUrl: onboardUrl}));

    // rename serviceId -> service
    // add to searchParams
    const {serviceId: service} = props;

    result.search = new URLSearchParams({
        code,
        callback: props.callback,
        ...(service && {service}),
        autoRedirect,
    }).toString();

    return {
        url: result.toString(),
        codeVerifier,
        session
    }
}