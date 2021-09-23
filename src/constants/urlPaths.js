import { compact } from "lodash";
import { URLError } from "../sdk/errors/errors";

/**
 * @private
 * @function getPrivateShareGuestURL
 * @throws Exception if missing parameters
 * @param {string} baseUrl
 * @param {string} sessionKey
 * @param {string} callbackUrl
 * @returns {string}
 */
export const getPrivateShareGuestURL = (baseUrl, sessionKey, callbackUrl) => `${baseUrl}/apps/quark/v1/direct-onboarding?sessionExchangeToken=${sessionKey}&callbackUrl=${callbackUrl}`;

/**
 * @private
 * @function getSessionURL
 * @throws Exception if missing parameters
 * @param {{baseUrl:string}} data
 * @returns {string}
 */
export const getSessionURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}permission-access/session`;

/**
 * @private
 * @function getOauthURL
 * @throws Exception if missing parameters
 * @param {{baseUrl:string}} data
 * @returns {string}
 */
export const getOauthURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}oauth/authorize`;

/**
 * @private
 * @function getOauthTokenURL
 * @throws Exception if missing parameters
 * @param {{baseUrl:string}} data
 * @returns {string}
 */
export const getOauthTokenURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}oauth/token`;

/**
 * @private
 * @function getAuthURL
 * @throws Exception if missing parameters
 * @param {{baseUrl:string}} data
 * @returns {string}
 */
export const getAuthURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}authorize`;

/**
 * @private
 * @function getTriggerURL
 * @throws Exception if missing parameters
 * @param {{baseUrl:string}} data
 * @returns {string}
 */
export const getTriggerURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}permission-access/trigger`;

/**
 * @private
 * @function getServicesURL
 * @throws Exception if missing parameters
 * @param {{baseUrl:string}} data
 * @returns {string}
 */
export const getServicesURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}discovery/services`;

/**
 * @private
 * @function getTokenReferenceURL
 * @throws Exception if missing parameters
 * @param {{baseUrl:string}} data
 * @returns {string}
 */
export const getTokenReferenceURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}oauth/token/reference`;

/**
 * @private
 * @function getServiceOnboardURL
 * @throws Exception if missing parameters
 * @param {{baseUrl:string}} data
 * @returns {string}
 */
export const getServiceOnboardURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}onboard`;

/**
 * @private
 * @function getFileURL
 * @throws Exception if missing parameters
 * @param {{baseUrl:string, sessionKey:string, fileName:string}} data
 * @returns {string}
 */
export const getFileURL = ({baseUrl, sessionKey, fileName}) => validate([baseUrl, sessionKey, fileName]) &&
    `${baseUrl}permission-access/query/${sessionKey}/${fileName}`;

/**
 * @private
 * @function getFileListURL
 * @throws Exception if missing parameters
 * @param {{baseUrl:string, sessionKey:string}} data
 * @returns {string}
 */
export const getFileListURL = ({baseUrl, sessionKey}) =>  validate([baseUrl, sessionKey]) &&
    `${baseUrl}permission-access/query/${sessionKey}`;

/**
 * @private
 * @function getPostboxURL
 * @throws Exception if missing parameters
 * @param {{baseUrl:string, postboxId:string}} data
 * @returns {string}
 */
export const getPostboxURL = ({baseUrl, postboxId}) => validate([baseUrl, postboxId]) &&
    `${baseUrl}permission-access/postbox/${postboxId}`;


/**
 * @private
 * @function getUserURL
 * @throws Exception if missing parameters
 * @param {{baseUrl:string}} data
 * @returns {string}
 */
export const getUserURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}user`;

/**
 * Check that all the required url parts are supplied
 * @private
 * @function validate
 * @throws Exception if missing parameters
 * @param {string[]} props[]
 * @returns {Boolean} all properties are valid
 */
const validate = props => {
	if (hasEmptyProps(props)) {
		throw new URLError("Missing URL props in request");
	}
	return true;
};

/**
 * Checks if the props array has any empty values
 * @private
 * @param {string[]} props
 * @returns {Boolean}
 */
const hasEmptyProps = props => compact(props).length !== props.length;