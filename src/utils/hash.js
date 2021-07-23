import base64url from "base64url";
import { sha256, sha512 } from "hash.js";
import { randomBytes } from "react-native-randombytes";
import "../definitions/defs";

const ALPHA_LOWER = "abcdefghijklmnopqrstuvwxyz";
const ALPHA_UPPER = ALPHA_LOWER.toUpperCase();
const NUMERIC = "0123456789";
const ALPHA_NUMERIC = `${ALPHA_LOWER}${ALPHA_UPPER}${NUMERIC}`;

/**
 * Create hash using SHA 256
 * @param {unknown} data data to hash
 * @returns {string} base64 result
 */
export const hashSHA256 = data => createHash(data, sha256);

/**
 * Create hash using SHA 512
 * @param {unknown} data data to hash
 * @returns {string} base64 result
 */
export const hashSHA512 = data => createHash(data, sha512);

/**
 *
 * @param {unknown} data data to hash
 * @param {function} hashFunction
 * @returns {string} base64 result
 */
const createHash = (data, hashFunction) => {
	const digest = hashFunction().update(data).digest();
	return base64url(digest);
};

/**
 *
 * @param {number} size
 * @returns {string} result
 */
export const getRandomAlphaNumeric = size => {
	const charsLength = ALPHA_NUMERIC.length;
	return new Array(size)
		.fill(0)
		.map(random => {
			do {
				random = randomBytes(1).readUInt8(0);
			} while (random > (256 - (256 % charsLength)));
			return ALPHA_NUMERIC[random % charsLength];
		})
		.join("");
};

/**
 * Returns a random hex string
 * @param {number} size
 * @returns {string} random hex of {@link size}
 */
export const getRandomHex = size => {
	return randomBytes(Math.ceil(size / 2))
		.toString("hex")
		.slice(0, size);
};