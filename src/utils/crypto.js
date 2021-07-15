// import NodeRSA from 'node-rsa';
const {cipher, util, pki} = require('node-forge');
const {randomBytes} = require('react-native-randombytes');
import { sha256, sha512 } from 'hash.js';
import base64url from 'base64url';

const BYTES = {
    DSK: [0, 256],
    DIV: [256, 272],
    HASH_DATA: [272],
    HASH: [0, 64],
    DATA: [64],
};

const ALPHA_LOWER = `abcdefghijklmnopqrstuvwxyz`;
const ALPHA_UPPER = ALPHA_LOWER.toUpperCase();
const NUMERIC = `0123456789`;
const ALPHA_NUMERIC = `${ALPHA_LOWER}${ALPHA_UPPER}${NUMERIC}`;

export const getRandomAlphaNumeric = (size) => {
    const charsLength = ALPHA_NUMERIC.length;
    const value = new Array(size);
    for (let i = 0; i < size; i++) {
        let random;
        do {
            random = randomBytes(1).readUInt8(0);
        } while (random > (256 - (256 % charsLength)));
        value[i] = ALPHA_NUMERIC[random % charsLength];
    }
    return value.join("");
};

export const hashSHA256 = data => createHash(data, sha256);
export const hashSHA512 = data => createHash(data, sha512);

const createHash = (data, hashFunction) => {
    const digest = hashFunction().update(data).digest();
    return base64url(digest)
}

const isValidSize = (data) => {
    const bytes = data.length;
    return bytes >= 352 && bytes % 16 === 0;
};

export const decryptData = async (privateKeyString, encryptedArrayBuffer) => {
    // Verify file data is of correct length
    if (!isValidSize(encryptedArrayBuffer)) {
        //throw new FileDecryptionError("File size not valid");
    }

    const encryptedDsk = encryptedArrayBuffer.slice(...BYTES.DSK);
    const dsk = decryptUsingKey(privateKeyString, encryptedDsk);

    const iv = util.createBuffer(encryptedArrayBuffer.slice(...BYTES.DIV))
    const encryptedData = util.createBuffer(encryptedArrayBuffer.slice(...BYTES.HASH_DATA))

    const jfsHashAndData = decipherData(encryptedData, dsk, iv)

    const jfsHash = jfsHashAndData.slice(...BYTES.HASH).toString();
    const jfsData = jfsHashAndData.slice(...BYTES.DATA).toString();

    // TODO -- compare hash here.


    return jfsData;
};

const decryptUsingKey = (privateKeyString, data) => {
    const privateKey = pki.privateKeyFromPem(privateKeyString);
    return privateKey.decrypt(data, "RSA-OAEP");
}

const decipherData = (encryptedData, dsk, iv) => {
    const decipher = cipher.createDecipher("AES-CBC", dsk)
    decipher.start({iv})
    decipher.update(encryptedData)
    decipher.finish();
    const {output} = decipher;
    return output.getBytes();
}