//import { ApiError } from "./types/api/api-error-response";

// tslint:disable:max-classes-per-file

/**
 * Generic Error thrown by the SDK.
 */
export class DigiMeSDKError extends Error {
    /* public */ name = "DigiMeSDKError";

    constructor(message/* : Error["message"] */) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Errors from OAuth
 */
export class OAuthError extends Error {
    /* public */ name = "OAuthError";

    constructor(message/* : Error["message"] */) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Thrown when an error response is received from digi.me API.
 * Error field will be populated with the response from digi.me.
 */
export class ServerError extends DigiMeSDKError {
    /* public */ name = "DigiMeServerError";
    /* public */ error/* ?: ApiError; */

    constructor(message/* : Error["message"] */, error /* ?:ApiError */) {
        super(message);
        this.error = error;
    }
}

/**
 * Thrown if the current SDK or its version is invalid.
 */
export class SDKInvalidError extends ServerError {
    /* public */ name = "SDKInvalidError";
}

/**
 * Thrown if the parameter passed in fails type check.
 */
export class TypeValidationError extends DigiMeSDKError {
    /* public */ name = "TypeValidationError";
}

/**
 * Thrown if there was an error decrypting a file.
 */
export class FileDecryptionError extends DigiMeSDKError {
    /* public */ name = "FileDecryptionError";
}

/**
 * Thrown if there's a mismatch of certificates when communicating with our production server.
 */
export class ServerIdentityError extends DigiMeSDKError {
    /* public */ name = "ServerIdentityError";
}

export class ExternalBrowserError extends DigiMeSDKError {
    name = "BrowserError"
}

export class InternalBrowserError extends DigiMeSDKError {
    name = "BrowserError"
}

export class AppLinkingError extends DigiMeSDKError {
    name = "AppLinkingError"
}

export class DecompressionError extends DigiMeSDKError {
    name = "DecompressionError"
}

export class URLError extends DigiMeSDKError {
    name = "URLError"
}