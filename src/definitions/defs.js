/**
 * Retry Options
 * @typedef {Object} RetryOptions
 * @property {number} retries
 */

/**
 * SDK Config Object
 * @typedef {Object} sdkConfig
 * @property {Boolean} [autoRedirect=false]
 * @property {number} [sleepPollingMS=5000]
 * @property {String} baseUrl
 * @property {string} onboardUrl
 * @property {RetryOptions} [retryOptions={retries:5}]
 */


/**
 * Contract details
 * @typedef {Object} contractDetails
 * @property {String} contractId
 * @property {String} privateKey
 * @property {String} redirectUri
 */


/**
 * Init return object
 * @typedef {Object} sdkInitReturn
 * @property {function({props})} getAuthorizeUrl
 * @property {function({props})} getOnboardServiceUrl
 * @property {function({props})} exchangeCodeForToken
 * @property {function({props})} readSession
 * @property {function({props})} getAvailableServices
 * @property {function({props})} readFile
 * @property {function({props})} readFileList
 * @property {function({props})} readAllFiles
 */