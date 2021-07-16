const {cipher, util, pki} = require('node-forge');
import { FileDecryptionError } from './errors/errors';
import { hashSHA512 } from '../utils/hash';

const BYTES = {
    DSK: [0, 256],
    DIV: [256, 272],
    HASH_DATA: [272],
    HASH: [0, 64],
    DATA: [64],
};

const isValidSize = (data) => {
    const bytes = data.length;
    return bytes >= 352 && bytes % 16 === 0;
};

export const decryptData = async (privateKeyString, encryptedArrayBuffer) => {
    // Verify file data is of correct length
    if (!isValidSize(encryptedArrayBuffer)) {
        throw new FileDecryptionError("File size not valid");
    }

    const encryptedDsk = encryptedArrayBuffer.slice(...BYTES.DSK);
    const dsk = decryptUsingKey(privateKeyString, encryptedDsk);

    const iv = util.createBuffer(encryptedArrayBuffer.slice(...BYTES.DIV))
    const encryptedData = util.createBuffer(encryptedArrayBuffer.slice(...BYTES.HASH_DATA))

    const jfsHashAndData = decipherData(encryptedData, dsk, iv)

    const jfsHash = jfsHashAndData.slice(...BYTES.HASH).toString();
    const jfsData = jfsHashAndData.slice(...BYTES.DATA).toString();

    if (compareDataHash(jfsData, jfsHash)) {
        throw new FileDecryptionError("Hash is not valid");
    }

    return jfsData;
};

const compareDataHash = (data, hash) => {
    const dataHash = hashSHA512(data);
    return dataHash === hash;
}

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