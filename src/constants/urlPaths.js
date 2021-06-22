export const getPrivateShareGuestURL = (baseUrl, sessionKey, callbackUrl) => `${baseUrl}/apps/quark/v1/direct-onboarding?sessionExchangeToken=${sessionKey}&callbackUrl=${callbackUrl}`

export const getSessionURL = baseUrl => `${baseUrl}permission-access/session`;
export const getOauthURL = baseUrl => `${baseUrl}oauth/authorize`
export const getAuthURL = baseUrl => `${baseUrl}authorize`;
export const getServices = baseUrl => `${baseUrl}discovery/services`;