import {cipher, util, pki} from "node-forge";
import { FileDecryptionError } from "./errors/errors";
import { getRandomHex, hashSHA512 } from "../utils/hash";
import { isEqual } from "lodash";
import "../definitions/defs";

/**
 * Character offsets to use when accessing data
 */
const BYTES = {
	DSK: [0, 256],
	DIV: [256, 272],
	HASH_DATA: [272],
	HASH: [0, 64],
	DATA: [64],
};

/**
 *
 * @param {ArrayBuffer} data - data to validate
 * @returns Boolean
 */
const isValidSize = (data) => {
	const bytes = data.length;
	return bytes >= 352 && bytes % 16 === 0;
};

/**
 * Decrypt data Buffer using PEM string. Performs validations
 * @function decryptData
 * @param {String} privateKeyString
 * @param {ArrayBuffer} encryptedArrayBuffer
 * @returns {String} decrypted data contents
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
 * @param {String} privateKeyPEM
 * @returns
 */
const createPrivateRSAKey = privateKeyPEM => pki.privateKeyFromPem(privateKeyPEM);

/**
 * Creates RSA Class instance
 * @param {String} publicKeyPEM
 * @returns
 */
const createPublicRSAKey = publicKeyPEM => pki.publicKeyFromPem(publicKeyPEM);

const compareDataHash = (data, hash) => {
	const dataHash = hashSHA512(data);
	return isEqual(dataHash, hash);
};

/**
 *
 * @param {String} privateKeyString
 * @param {ArrayBuffer} data
 * @returns
 */
const decryptUsingKey = (privateKeyString, data) => {
	return createPrivateRSAKey(privateKeyString)
		.decrypt(data, "RSA-OAEP");
};

/**
 *
 * @param {String} encryptedData
 * @param {String} dsk
 * @param {String} iv
 * @returns
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
 *
 * @param {String} unEncryptedData
 * @param {String} dsk
 * @param {String} iv
 * @returns String - base64
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
 * @function encryptData
 * @param {String} publicKey
 * @param {String} privateKey
 * @param {{fileData:String, fileName:String, fileDescriptor:String}} data
 * @returns {{iv:String, encryptedData:String, encryptedKey:String, encryptedMeta:String}} result
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