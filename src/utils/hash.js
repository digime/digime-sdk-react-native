import base64url from "base64url";
import { sha256, sha512 } from "hash.js";
import { randomBytes } from "react-native-randombytes";

const ALPHA_LOWER = "abcdefghijklmnopqrstuvwxyz";
const ALPHA_UPPER = ALPHA_LOWER.toUpperCase();
const NUMERIC = "0123456789";
const ALPHA_NUMERIC = `${ALPHA_LOWER}${ALPHA_UPPER}${NUMERIC}`;

export const hashSHA256 = data => createHash(data, sha256);
export const hashSHA512 = data => createHash(data, sha512);

const createHash = (data, hashFunction) => {
	const digest = hashFunction().update(data).digest();
	return base64url(digest);
};

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

	/*
    for (let i = 0; i < size; i++) {
        let random;
        do {
            random = randomBytes(1).readUInt8(0);
        } while (random > (256 - (256 % charsLength)));
        value[i] = ALPHA_NUMERIC[random % charsLength];
    }
    return value.join("");
    */
};