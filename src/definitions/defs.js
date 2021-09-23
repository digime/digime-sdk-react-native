/**
 * @file defs.js
 */

/**
 * @description SDK Config Object
 * @typedef {Object} sdkConfig
 * @property {Boolean} [autoRedirect=false] - Redirect back to application from api digi.me when an error is encountered
 * @property {number} [sleepPollingMS=5000] - default time to wait between subsequent calls on `STATE.Pending` from `readAllFiles()`
 * @property {string} applicationId - Customised, and unique, Application ID from digi.me
 * @property {string} [baseUrl="https://api.digi.me/v1.6/"] Root URL for the digi.me API
 * @property {string} [onboardUrl="https://api.digi.me/apps/saas/"] Root URL for the digi.me web onboard
 * @property {Object} [retryOptions]
 * @property {number} [retryOptions.retries=5] Options to specify retry logic for failed API calls
 */

/**
 * @description Contract details
 * @typedef {Object} contractDetails
 * @property {string} contractId contract ID supplied from digi.me
 * @property {string} privateKey The private key (in PKCS#8 format) for this contract.
 * @property {string} redirectUri An accepted uri to redirect to after authorization The url must be whitelisted on the contract
 */


/**
 * @description Init return object
 * SDK functions returned back after the SDK has been initiated using `init()`
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
 * @description User AccessToken
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
 * @property {number} [serviceId]
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
 * @description Function arguments from `getOnboardServiceUrl()`
 * @typedef {Object} getOnboardServiceUrlProps
 * @property {string} callback
 * @property {number} serviceId
 * @property {contractDetails} contractDetails
 * @property {userAccessToken} userAccessToken
 */
/**
 * @todo
 * @typedef {Object} getOnboardServiceUrlResponse
 */
/**
 * @description Function arguments from `exchangeCodeForToken()`
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
 * @description Function arguments from `readSession()`
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
 * @description Function arguments from `getAvailableServices()`
 * @typedef {Object} getAvailableServicesProps
 * @property {string} contractId contract ID supplied from digi.me
 */
/**
 * @todo
 * @typedef {Object} getAvailableServicesResponse
 */
/**
 * @description Function arguments from `readFile()`
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
 * @description Function arguments from `readFileList()`
 * @typedef {Object} readFileListProps
 * @property {string} sessionKey
 */

/**
 * @todo
 * @typedef {Object} readFileListResponse
 */

/**
 * @description Function arguments from `readAllFiles()`
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
 * @description Function arguments from `write()`
 * @typedef {Object} writeProps
 * @property {contractDetails} contractDetails
 * @property {userAccessToken} userAccessToken
 * @property {fileData} data
 * @property {string} publicKey
 * @property {string} postboxId
 */

/**
 * @description file data definition
 * @typedef {Object} fileData
 * @property {fileDescriptor} fileDescriptor
 * @property {string} fileName
 * @property {string} fileData
 */

/**
 * @typedef {Object} fileDescriptor
 * @property {string} mimeType MimeType of the file that has been pushed in
 * @property {string} accounts MimeType of the file that has been pushed in
 * @property {Array<string>} [tags] Any tags you might want to attach with the file. Used when you want to retrieve it again.
 * @property {Array<string>} [reference]
 * @property {Array<account>} accounts An array of account objects used to identify the user in your system.
 */

/**
 * @typedef {Object} account
 * @property {string} accountId Account ID of the user in your system. Currently this is a required field for all data to be pushed in.
 */

/**
 * @todo
 * @description Response from digi.me API on `write()`
 * @typedef {Object} writeResponse
 */
/**
 * @description Function arguments from `deleteUser()`
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
 * @description Function arguments from `readAccount()`
 * @typedef {Object} readAccountsProps
 * @property {string} sessionKey
 * @property {string} privateKey
 */
/**
 * @typedef {Object} readAccountsResponse
 * @property {any} accounts
 */
/**
 * @description Function arguments from `triggerPush()`
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