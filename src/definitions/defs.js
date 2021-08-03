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
 * @property {Object} retryOptions
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
 * @property {function(getAuthorizeUrlProps):Promise<getAuthorizeUrlResponse>} getAuthorizeUrl
 * @property {function(getOnboardServiceUrlProps):Promise<getOnboardServiceUrlResponse>} getOnboardServiceUrl
 * @property {function(exchangeCodeForTokenProps):Promise<exchangeCodeForTokenResponse>} exchangeCodeForToken
 * @property {function(readSessionProps):Promise<readSessionResponse>} readSession
 * @property {function(getAvailableServicesProps):Promise<getAvailableServicesResponse>} getAvailableServices
 * @property {function(readFileProps):Promise<readFileResponse>} readFile
 * @property {function(readFileListProps):Promise<readFileListResponse>} readFileList
 * @property {function(readAllFilesProps):Promise<readAllFilesResponse>} readAllFiles
 * @property {function(writeProps):Promise<writeResponse>} write
 * @property {function(deleteUserProps):Promise<deleteUserResponse>} deleteUser
 * @property {function(readAccountsProps):Promise<readAccountsResponse>} readAccounts
 */

/**
 * User AccessToken Object
 * @typedef {Object} userAccessToken
 * @property {Object} accessToken
 * @property {string} accessToken.value
 * @property {number} accessToken.expiry
 * @property {Object} refreshToken
 * @property {string} refreshToken.value
 * @property {number} refreshToken.expiry
 */

/**
 * @typedef {Object} getAuthorizeUrlProps
 * @property {string} callback
 * @property {string?} serviceId
 */
/**
 * @typedef {Object} getAuthorizeUrlResponse
 * @property {string} url
 * @property {string} codeVerifier
 * @property {string} session
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
 * @property {Object.<string, string>} scope
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
 * @property {(data:{fileName:string, fileData:string, fileList: string[]})=>void} onFileData,
 * @property {(data:{error:string, fileName:string, fileList: string[]})=>void} onFileError
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

module.exports = {};