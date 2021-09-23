import JSR from "jsrsasign";
import { getRandomAlphaNumeric } from "../utils/hash";
import { SigningError } from "./errors/errors";
import {isNil} from "lodash";

/**
 * @private
 */
const JWS = JSR.jws.JWS;

/**
 * Creates a JSON Web Token used for API requests using PS512 algorithm.
 * creates `nonce`, `timestamp`, `client_id`
 * @private
 * @async
 * @function createJWT
 * @param {Object.<string, number | string>} payload - any data required to be added into the payload of the JWT
 * @param {{applicationId:string, contractId:string}} payloadOptions - additional options required for params in payload
 * @param {string} privateKey - PEM string
 * @returns {Promise<string>} JWT result
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
 * Creates JSON Web Token, using given parameters
 * @async
 * @private
 * @function sign
 * @param {string|Object.<string, string>} header
 * @param {string|Object.<string, number | string>} payload
 * @param {string} privateKey
 * @returns {Promise<string>}
 */
const sign = (header, payload, privateKey) => {
	// double check required parameters are set
	const missing = Object.entries({header, payload, privateKey})
		.filter(([,value]) => isNil(value))
		.map(([key]) => key);

	if (missing.length > 0) {
		throw new SigningError(`Missing parameter(s) required for signing: ${missing.join(",")}`);
	}

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
			throw new SigningError(error);
		}
	});
};

/**
 * @private
 * @typedef {Object} JWTHeader
 * @property {string} jku - JSON Web Key url
 * @property {string} kid - optional param showing which encryption key was used
 */

/**
 * decodes JWT to header, payload, and signature components
 * @private
 * @function decode
 * @param {string} token
 * @returns {{header:JWTHeader, payload:Object.<string, number | string>, signature:string}} result
 */
export const decode = (token) => {
	const asoArray = JWS.parse(token);

	return {
		header: asoArray?.headerObj,
		payload: asoArray?.payloadObj,
		signature: asoArray?.sigHex
	};
};

/**
 * Verify JWT against it's signature and algorithm
 * @todo add validation on the signature
 * @private
 * @function verify
 * @param {string} signature
 * @param {string} key
 * @param {string} alg
 * @returns {Boolean} JWT is valid
 */
export const verify = (signature, key, alg) => {
	return true;
	/*
	const args = {
		signature,
		key,
		{
			alg
		}
	};

	return JWS.verifyJWT(...args);
	*/
};