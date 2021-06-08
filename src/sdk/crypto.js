/*!
 * Copyright (c) 2009-2021 digi.me Limited. All rights reserved.
 */

import { randomBytes } from 'react-native-randombytes';
import * as hash from 'hash';

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