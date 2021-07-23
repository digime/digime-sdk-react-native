import JSR from "jsrsasign";
import { getRandomAlphaNumeric } from "../utils/hash";
import { ServerError } from "./errors/errors";
import "../definitions/defs";

const JWS = JSR.jws.JWS;

/**
 * Creates a JSON Web Token used for API requests using PS512 algorithm.
 * creates `nonce`, `timestamp`, `client_id`
 * @async
 * @function createJWT
 * @param {{}} payload - any data required to be added into the payload of the JWT
 * @param {{applicationId:string, contractId:string}} payloadOptions - additional options required for params in payload
 * @param {string} privateKey - PEM string
 * @returns {string} JWT result
 */
export const createJWT = async (payload, payloadOptions, privateKey) => {
	const {applicationId, contractId} = payloadOptions;
	const client_id = `${applicationId}_${contractId}`;

	payload = {
		nonce: getRandomAlphaNumeric(32),
		timestamp: new Date().getTime(),
		client_id,
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
	);
};

/**
 * @async
 * @function sign
 * @param {{}}} header
 * @param {{}} payload
 * @param {string} privateKey
 * @returns {Promise<string>}
 */
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
			throw new ServerError(error);
		}
	});
};

/**
 * decodes JWT to header, payload, and signature components
 * @function decode
 * @param {string} token
 * @returns {{header:String, payload:String, signature:String}} result
 */
export const decode = (token) => {
	const asoArray = JWS.parse(token);

	return {
		header: asoArray?.headerObj,
		payload: asoArray?.payloadObj,
		signature: asoArray?.sigHex
	};
};

// TODO implement verify JWT
export const verify = (signature, key, alg) => {
	const args = (
		signature,
		key,
		{
			alg
		}
	);

	return JWS.verifyJWT(...args);
};