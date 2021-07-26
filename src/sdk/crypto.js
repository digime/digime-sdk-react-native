import {cipher, util, pki} from "node-forge";
import { FileDecryptionError } from "./errors/errors";
import { getRandomHex, hashSHA512 } from "../utils/hash";
import { isEqual } from "lodash";
import "../definitions/defs";

/**
 * Character offsets to use when accessing data
 * @readonly
 * @enum {number[]}
 */
const BYTES = {
	/** Data offset for (encrypted) DSK sector */
	DSK: [0, 256],

	/** Data offset for (non-encrypted) DIV sector */
	DIV: [256, 272],

	/** Data offset for (encrypted) hash&data sector */
	HASH_DATA: [272],

	/** Data offsets for (non-encrypted) hash within hash&data sector */
	HASH: [0, 64],

	/** Data offset for (encrypted) data within hash&data sector */
	DATA: [64],
};

/**
 * Checks that the data is the correct size
 * @function isValidSize
 * @param {Uint8Array} data - data to validate
 * @returns {Boolean}
 */
const isValidSize = (data) => {
	const bytes = data.length;
	return bytes >= 352 && bytes % 16 === 0;
};

/**
 * Decrypt data Buffer using PEM string. Performs validations
 * @function decryptData
 * @param {string} privateKeyString
 * @param {string|Uint8Array} encryptedArrayBuffer
 * @returns {string} decrypted data contents
 */
export const decryptData = (privateKeyString, encryptedArrayBuffer) => {
	// Verify file data is of correct length
	if (!isValidSize(encryptedArrayBuffer)) {
		throw new FileDecryptionError("File size not valid");
	}

	const encryptedDsk = encryptedArrayBuffer.slice(...BYTES.DSK);
	const dsk = decryptUsingKey(privateKeyString, encryptedDsk);

	const iv = util.createBuffer(encryptedArrayBuffer.slice(...BYTES.DIV));
	const encryptedData = util.createBuffer(encryptedArrayBuffer.slice(...BYTES.HASH_DATA));

	const jfsHashAndData = decipherData(encryptedData, dsk, iv);

	const jfsHash = jfsHashAndData.slice(...BYTES.HASH).toString();
	const jfsData = jfsHashAndData.slice(...BYTES.DATA).toString();

	if (compareDataHash(jfsData, jfsHash)) {
		throw new FileDecryptionError("Hash is not valid");
	}

	return jfsData;
};

/**
 * Creates RSA Class instance
 * @function createPrivateRSAKey
 * @param {string} privateKeyPEM
 * @returns {pki.rsa.PrivateKey}
 */
const createPrivateRSAKey = privateKeyPEM => pki.privateKeyFromPem(privateKeyPEM);

/**
 * Creates RSA Class instance
 * @function createPublicRSAKey
 * @param {string} publicKeyPEM
 * @returns {pki.rsa.PublicKey}
 */
const createPublicRSAKey = publicKeyPEM => pki.publicKeyFromPem(publicKeyPEM);

/**
 * Computes a `hash` from the {@link data} and compares with the given (expected) {@link hash}
 * @function compareDataHash
 * @param {*} data
 * @param {*} hash
 * @returns {Boolean} sha512({@link data}) is equal to {@link hash}
 */
const compareDataHash = (data, hash) => {
	const dataHash = hashSHA512(data);
	return isEqual(dataHash, hash);
};

/**
 * @function decryptUsingKey
 * @param {string} privateKeyString
 * @param {string} data
 * @returns {string}
 */
const decryptUsingKey = (privateKeyString, data) => {
	return createPrivateRSAKey(privateKeyString)
		.decrypt(data, "RSA-OAEP");
};

/**
 * decrypt data using {@link dsk} and {@link iv} parameters
 * @function decipherData
 * @param {string} encryptedData
 * @param {string} dsk
 * @param {string} iv
 * @returns {string} - base 64 result
 */
const decipherData = (encryptedData, dsk, iv) => {
	const blockCipher = cipher.createDecipher("AES-CBC", dsk);
	blockCipher.start({iv});
	blockCipher.update(encryptedData);
	blockCipher.finish();
	const {output} = blockCipher;
	return output.getBytes();
};

/**
 * Encrypt data using {@link dsk} and {@link iv} parameters
 * @function cipherData
 * @param {string} unEncryptedData
 * @param {string} dsk
 * @param {string} iv
 * @returns {string} - base64
 */
const cipherData = (unEncryptedData, dsk, iv) => {
	const blockCipher = cipher.createCipher("AES-CBC", dsk);
	blockCipher.start({iv});
	blockCipher.update(util.createBuffer(unEncryptedData));
	blockCipher.finish();
	const {output} = blockCipher;
	const asBase64 = util.encode64(output.getBytes());
	return asBase64;
};

/**
 * Encrypts data using a given publicKey
 * @function encryptData
 * @param {string} publicKey
 * @param {Object} data
 * @param {string} data.fileData
 * @param {string} data.fileName
 * @param {string} data.fileDescriptor
 * @returns {{iv:string, encryptedData:string, encryptedKey:string, encryptedMeta:string}} result
 */
export const encryptData = (publicKey, data) => {
	// generate random keys
	const key = getRandomHex(32); //64 for js sdk
	const iv = getRandomHex(16); // 32 for js sdk

	const publicRSAKey = createPublicRSAKey(publicKey);
	const encryptedKey = util.encode64(publicRSAKey.encrypt(key));

	const {fileData, fileDescriptor} = data;
	const encryptedData = cipherData(fileData, key, iv);
	const encryptedMeta = cipherData(fileDescriptor, key, iv);

	return {
		iv,
		encryptedKey,
		encryptedData,
		encryptedMeta
	};
};