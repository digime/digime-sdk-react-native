/**
 * Generic Error thrown by the SDK.
 */
export class DigiMeSDKError extends Error {
    name = "DigiMeSDKError";

    constructor(message) {
        super(message);
    }
}

/**
 * Errors from OAuth
 */
export class OAuthError extends Error {
    name = "OAuthError";

    constructor(message) {
        super(message);
    }
}

/**
 * Thrown when an error response is received from digi.me API.
 * Error field will be populated with the response from digi.me.
 */
export class ServerError extends DigiMeSDKError {
    name = "DigiMeServerError";
    error

    constructor(message, error) {
        super(message);
        this.error = error;
    }
}

/**
 * Thrown if the current SDK or its version is invalid.
 */
export class SDKInvalidError extends ServerError {
    name = "SDKInvalidError";
}

/**
 * Thrown if the parameter passed in fails type check.
 */
export class TypeValidationError extends DigiMeSDKError {
    name = "TypeValidationError";
}

/**
 * Thrown if there was an error decrypting a file.
 */
export class FileDecryptionError extends DigiMeSDKError {
    name = "FileDecryptionError";
}

/**
 * Thrown if there's a mismatch of certificates when communicating with our production server.
 */
export class ServerIdentityError extends DigiMeSDKError {
    name = "ServerIdentityError";
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

/**
 * Thrown during the JWT signing process
 */
export class SigningError extends DigiMeSDKError {
    name = "SigningError"
}