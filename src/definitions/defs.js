/**
 * @file defs.js
 */

/**
 * SDK Config Object
 * @typedef {Object} sdkConfig
 * @property {Boolean} [autoRedirect=false] - Redirect back to application from api digi.me on error
 * @property {number} [sleepPollingMS=5000]
 * @property {string} applicationId - Customised, and unique, Application ID from digi.me
 * @property {string} [baseUrl="https://api.digi.me/v1.6/"]
 * @property {string} [onboardUrl="https://api.digi.me/apps/saas/"]
 * @property {Object} [retryOptions]
 * @property {number} [retryOptions.retries=5]
 */

/**
 * Contract details
 * @typedef {Object} contractDetails
 * @property {string} contractId
 * @property {string} privateKey
 * @property {string} redirectUri
 */


/**
 * Init return object
 * @typedef {Object} sdkInitReturn
 * @property {getAuthCallback} getAuthorizeUrl
 * @property {getOnboardingServiceCallback} getOnboardServiceUrl
 * @property {exchangeCodeForTokenCallback} exchangeCodeForToken
 * @property {readSessionCallback} readSession
 * @property {getAvailableServicesCallback} getAvailableServices
 * @property {readFileCallback} readFile
 * @property {readFileListCallback} readFileList
 * @property {readAllFilesCallback} readAllFiles
 * @property {writeCallback} write
 * @property {deleteUserCallback} deleteUser
 * @property {readAccountsCallback} readAccounts
 */

/**
 * User AccessToken Object
 * @typedef {Object} userAccessToken
 * @property {Object} accessToken
 * @property {string} accessToken.value
 * @property {number} accessToken.expires
 * @property {Object} refreshToken
 * @property {string} refreshToken.value
 * @property {number} refreshToken.expires
 */

/**
 * @callback getAuthCallback
 * @param {getAuthorizeUrlProps} props
 * @returns {Promise<getAuthorizeUrlResponse>}
 */

/**
 * @callback getOnboardingServiceCallback
 * @param {getOnboardServiceUrlProps} props
 * @returns {Promise<getOnboardServiceUrlResponse>}
 */
/**
 * @callback exchangeCodeForTokenCallback
 * @param {exchangeCodeForTokenProps} props
 * @returns {Promise<exchangeCodeForTokenResponse>}
 */
/**
 * @callback readSessionCallback
 * @param {readSessionProps} props
 * @returns {Promise<readSessionResponse>}
 */
/**
 * @callback getAvailableServicesCallback
 * @param {getAvailableServicesProps} props
 * @returns {Promise<getAvailableServicesResponse>}
 */
/**
 * @callback readFileCallback
 * @param {readFileProps} props
 * @returns {Promise<readFileResponse>}
 */
/**
 * @callback readFileListCallback
 * @param {readFileListProps} props
 * @returns {Promise<readFileListResponse>}
 */
/**
 * @callback readAllFilesCallback
 * @param {readAllFilesProps} props
 * @returns {Promise<readAllFilesResponse>}
 */
/**
 * @callback writeCallback
 * @param {writeProps} props
 * @returns {Promise<writeResponse>}
 */
/**
 * @callback deleteUserCallback
 * @param {deleteUserProps} props
 * @returns {Promise<deleteUserResponse>}
 */
/**
 * @callback readAccountsCallback
 * @param {readAccountsProps} props
 * @returns {Promise<readAccountsResponse>}
 */
/**
 * @typedef {Object} getAuthorizeUrlProps
 * @property {string} callback
 * @property {contractDetails} contractDetails
 * @property {state} [state]
 * @property {scope} [scope]
 * @property {string} [serviceId]
 * @property {userAccessToken} [userAccessToken]
 */
/**
 * @typedef {Object} getAuthorizeUrlResponse
 * @property {string} url
 * @property {string} codeVerifier
 * @property {session} session
 */
/**
 * @typedef {Object} session
 * @property {string} expires
 * @property {string} key
 */
/**
 * @typedef {string} state
 */
/**
 * @todo
 * @typedef {Object} getOnboardServiceUrlProps
 */
/**
 * @todo
 * @typedef {Object} getOnboardServiceUrlResponse
 */
/**
 * @typedef {Object} exchangeCodeForTokenProps
 * @property {string} authorizationCode
 * @property {string} codeVerifier
 * @property {contractDetails} contractDetails
 */
/**
 * @typedef {Object} exchangeCodeForTokenResponse
 * @property {userAccessToken} userAccessToken
 */
/**
 * @typedef {Object} readSessionProps
 * @property {contractDetails} contractDetails
 * @property {userAccessToken} userAccessToken
 * @property {scope} [scope]
 */
/**
 * @typedef {Object.<string, string>} scope
 */
/**
 * @typedef {Object} readSessionResponse
 * @property {string} session
 * @property {userAccessToken} [updatedAccessToken]
 */
/**
 * @typedef {Object} getAvailableServicesProps
 * @property {string} contractId
 */
/**
 * @todo
 * @typedef {Object} getAvailableServicesResponse
 */
/**
 * @typedef {Object} readFileProps
 * @property {string} fileName
 * @property {string} privateKey
 * @property {string} sessionKey
 */
/**
 * @typedef {Object} readFileResponse
 * @property {string} fileData
 * @property {string} fileMetadata
 * @property {string} fileName
 */

/**
 * @typedef {Object} readFileListProps
 * @property {string} sessionKey
 */

/**
 * @todo
 * @typedef {Object} readFileListResponse
 */

/**
 * @typedef {Object} readAllFilesProps
 * @property {string} sessionKey
 * @property {string} privateKey
 * @property {onFileDataCallback} onFileData,
 * @property {onFileErrorCallback} onFileError
 */

/**
 * @callback onFileErrorCallback
 * @param {fileError} data
 */

/**
 * @typedef {Object} fileError
 * @property {string} error
 * @property {string} fileName
 * @property {string[]} fileList
 */

/**
 * @callback onFileDataCallback
 * @param {fileData} data
 */

/**
 * @typedef {Object} fileData
 * @property {string} fileName
 * @property {string} fileData
 * @property {string[]} fileList
 */

/**
 * @typedef {Object} readAllFilesResponse
 * @property {()=>any} stopPolling
 * @property {Promise<any>} filePromise
 */
/**
 * @typedef {Object} writeProps
 * @property {contractDetails} contractDetails
 * @property {userAccessToken} userAccessToken
 * @property {Object} data
 * @property {string} data.fileDescriptor
 * @property {string} data.fileName
 * @property {string} data.fileData
 * @property {string} publicKey
 * @property {string} postboxId
 */
/**
 * @todo
 * @typedef {Object} writeResponse
 */
/**
 * @typedef {Object} deleteUserProps
 * @property {userAccessToken} userAccessToken
 * @property {contractDetails} contractDetails
 */
/**
 * @typedef {Object} deleteUserResponse
 * @property {Boolean} deleted
 * @property {any} response
 */
/**
 * @typedef {Object} readAccountsProps
 * @property {string} sessionKey
 * @property {string} privateKey
 */
/**
 * @typedef {Object} readAccountsResponse
 * @property {any} accounts
 */
/**
 * @private
 * @typedef {Object} triggerPushProps
 * @property {string} accessToken
 * @property {contractDetails} contractDetails
 * @property {string} postboxId
 * @property {string} publicKey
 * @property {Object} data
 * @property {string} data.fileDescriptor
 * @property {string} data.fileName
 */

/**
 * @typedef {Object} appLinkingInitReturn
 * @property {addRouteCallback} addRoute
 * @property {function()} unload
 */

/**
 * @callback addRouteCallback
 * @param {string} route URL route to watch under the scheme, e.g, Scheme://${route}
 * @param {callbackProps} callback function callback when scheme+route is called
 * @returns {addRouteReturn}
 */

/**
 * @callback callbackProps
 * @param {Object.<string, number | string>} searchParams
 */

/**
 * @typedef {string} addRouteReturn
 */
/**
 * @typedef {Object} authoriseProps
 * @property {contractDetails} contractDetails
 * @property {state} [state]
 * @property {scope} [scope]
 * @property {userAccessToken} [userAccessToken]
 */
module.exports = {};