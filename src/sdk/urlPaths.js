/**
 * Changes so far; on functions related to authorize: session is now returned
 * https://digi-me.atlassian.net/wiki/spaces/JSSDK/pages/1901658123/JS+SDK+Structure
 */
export const getAvailableServicesURL = baseUrl => "getAvailableServices";
export const prepareFilesUsingAccessTokenURL = baseUrl => "prepareFilesUsingAccessToken";
export const generateAuthorizationLinkURL = baseUrl => "generateAuthorizationLink";

export const getPrivateShareGuestURL = (baseUrl, sessionKey, callbackUrl) => `${baseUrl}/apps/quark/v1/direct-onboarding?sessionExchangeToken=${sessionKey}&callbackUrl=${callbackUrl}`

export const getSessionURL = (baseUrl) => `${baseUrl}/permission-access/session`;
export const getAuthURL = baseUrl => `${baseUrl}/oauth/authorize`