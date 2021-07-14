// import NodeRSA from 'node-rsa';
const {cipher, util, pki} = require('node-forge');
const {randomBytes} = require('react-native-randombytes');
const hash = require('hash.js');

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

export const hashSha256 = (data) => hash.sha256().update(data).digest();
export const hashSha512 = (data) => hash.sha512().update(data).digest();


const isValidSize = (data) => {
    const bytes = data.length;
    return bytes >= 352 && bytes % 16 === 0;
};


export const decryptData = async (privateKeyString, encryptedArrayBuffer) => {
    // Verify file data is of correct length
    if (!isValidSize(encryptedArrayBuffer)) {
        console.log("IS NOT VALID NOW")
        //throw new FileDecryptionError("File size not valid");
    } else {
        console.log("IS VALID")
    }


    const privateKey = pki.privateKeyFromPem(privateKeyString);

    const encryptedDsk = encryptedArrayBuffer.slice(...BYTES.DSK);
    const dsk = privateKey.decrypt(encryptedDsk, "RSA-OAEP")

    const iv = util.createBuffer(encryptedArrayBuffer.slice(...BYTES.DIV))
    const encryptedData = util.createBuffer(encryptedArrayBuffer.slice(...BYTES.HASH_DATA))

    const decipher = cipher.createDecipher("AES-CBC", dsk)

    decipher.start({iv})
    decipher.update(encryptedData)
    decipher.finish();

    const {output} = decipher;
    const jfsHashAndData = output.getBytes();

    const jfsHash = jfsHashAndData.slice(...BYTES.HASH).toString()
    const jfsData = jfsHashAndData.slice(...BYTES.DATA).toString()

    const jfsObject = JSON.parse(jfsData);
    console.log(JSON.stringify(jfsObject, null, 4))

    return "is ret"

};