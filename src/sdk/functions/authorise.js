import base64url from "base64url";
import {request} from "../http/request";
import {getOauthURL, getAuthURL} from "../../constants/urlPaths";
import {decode, createJWT, verify} from "../jwt";
import {URL, URLSearchParams} from "react-native-url-polyfill";
import { getAuthHeader } from "../../utils/url";
import { DigiMeSDKError } from "../errors/errors";
import { isString } from "lodash";
import { getRandomAlphaNumeric, hashSHA256 } from "../../utils/hash";
import { sdkConfig, authoriseProps, getAuthorizeUrlProps, getAuthorizeUrlResponse } from "../../definitions/defs";
import { createObjectFrom } from "../../utils/objectUtils";

/**
 * Generates the JWT (JSON Web Token)
 * @async
 * @function generateToken
 * @param {string} applicationId
 * @param {string} contractId
 * @param {string} privateKey
 * @param {string} redirectUri
 * @param {Object.<string, string>} [additionalData] additional props to add to signing e,g, 'access_token':"ACCESS_TOKEN_VALUE"
 * @param {string} [state]
 * @returns {Promise<{jwt:string, codeVerifier:string}>}
 */
const generateToken = async (applicationId, contractId, privateKey, redirectUri, additionalData=null, state=null) => {
	const codeVerifier = base64url(getRandomAlphaNumeric(32));
	const jwt = await createJWT(
		{
			code_challenge: hashSHA256(codeVerifier),
			code_challenge_method: "S256",
			redirect_uri: redirectUri,
			response_mode: "query",
			response_type: "code",
			...(additionalData),
			...(state),
		},
		{
			applicationId,
			contractId,
		},
		privateKey
	);

	return {
		jwt,
		codeVerifier
	};
};

/**
 * Returns the payload from a given JWT
 * @todo add validation
 * @async
 * @function getPayloadFromToken
 * @param {string} token (JWT)
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<any>}
 */
export const getPayloadFromToken = async (token, sdkConfig) => {
	const {
		payload,
		header
	} = decode(token);

	const jku = header?.jku;
	const kid = header?.kid;

	if (!isString(jku) || !isString(kid)) {
		throw new DigiMeSDKError("Unexpected JWT payload in token. No jku or kid found.");
	}

	const {data:jkuResponse} = await request.direct.get(jku);

	if(!jkuResponse) {
		throw new DigiMeSDKError("Server returned non-JWKS response");
	}

	const pem = jkuResponse
		.keys
		.filter((key) => key.kid === kid)
		.map((key) => key.pem);

	// TODO implement this function
	// currently erroring somewhere
	//verify(token, pem[0], ["PS512"]);

	// todo: add token validation validation.. .
	/*
    return {
        code: decodedToken.payload
    };
    */

	return {
		...payload
	};
};

/**
 * @function authorise
 * @async
 * @param {authoriseProps} props
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<{codeVerifier:string, code:string, session:string}>}
 */
const authorise = async (props, sdkConfig) => {
	const {
		contractDetails,
		state,
		scope,
		userAccessToken
	} = props;

	const {applicationId} = sdkConfig;

	const {
		contractId,
		privateKey,
		redirectUri
	} = contractDetails;

	// add the userAccessToken if available
	const additionalData = createObjectFrom([
		{
			lookupKey: "accessToken.value",
			outputKey: "access_token",
			source: userAccessToken
		}
	]);

	const {jwt, codeVerifier} = await generateToken(
		applicationId,
		contractId,
		privateKey,
		redirectUri,
		additionalData,
		state
	);

	const {data:body} = await request.func.post(
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

	const {
		preauthorization_code: code
	} = await getPayloadFromToken(body?.token, sdkConfig);

	const session = body?.session;

	return {
		codeVerifier,
		code,
		session
	};
};

/**
 *
 * @async
 * @function getAuthorizeUrl
 * @param {getAuthorizeUrlProps} props
 * @param {sdkConfig} sdkConfig
 * @returns {Promise<getAuthorizeUrlResponse>}
 */
export const getAuthorizeUrl = async (props, sdkConfig) => {
	// rename serviceId -> service (id)
	// add to searchParams
	const {serviceId: service, callback} = props;
	const {autoRedirect, onboardUrl: baseUrl} = sdkConfig;
	const {
		codeVerifier,
		code,
		session,
	} = await authorise(props, sdkConfig);

	const result = new URL(getAuthURL({baseUrl}));
	result.search = new URLSearchParams({
		code,
		callback,
		...(service && {service}),
		autoRedirect,
	}).toString();

	return {
		url: result.toString(),
		codeVerifier,
		session
	};
};