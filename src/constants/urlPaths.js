import { compact } from "lodash";
import { URLError } from "../sdk/errors/errors";

/**
 * @function getPrivateShareGuestURL
 * @param {String} baseUrl
 * @param {String} sessionKey
 * @param {String} callbackUrl
 * @returns {String}
 */
export const getPrivateShareGuestURL = (baseUrl, sessionKey, callbackUrl) => `${baseUrl}/apps/quark/v1/direct-onboarding?sessionExchangeToken=${sessionKey}&callbackUrl=${callbackUrl}`;

/**
 * @function getSessionURL
 * @param {{baseUrl:String}}
 * @returns {String}
 */
export const getSessionURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}permission-access/session`;

/**
 * @function getOauthURL
 * @param {{baseUrl:String}}
 * @returns {String}
 */
export const getOauthURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}oauth/authorize`;

/**
 * @function getOauthTokenURL
 * @param {{baseUrl:String}}
 * @returns {String}
 */
export const getOauthTokenURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}oauth/token`;

/**
 * @function getAuthURL
 * @param {{baseUrl:String}}
 * @returns {String}
 */
export const getAuthURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}authorize`;

/**
 * @function getTriggerURL
 * @param {{baseUrl:String}}
 * @returns {String}
 */
export const getTriggerURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}permission-access/trigger`;

/**
 * @function getServicesURL
 * @param {{baseUrl:String}}
 * @returns {String}
 */
export const getServicesURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}discovery/services`;

/**
 * @function getTokenReferenceURL
 * @param {{baseUrl:String}}
 * @returns {String}
 */
export const getTokenReferenceURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}oauth/token/reference`;

/**
 * @function getServiceOnboardURL
 * @param {{baseUrl:String}}
 * @returns {String}
 */
export const getServiceOnboardURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}onboard`;

/**
 * @function getFileURL
 * @param {{baseUrl:String, sessionKey:String, fileName:String}}
 * @returns {String}
 */
export const getFileURL = ({baseUrl, sessionKey, fileName}) => validate([baseUrl, sessionKey, fileName]) &&
    `${baseUrl}permission-access/query/${sessionKey}/${fileName}`;

/**
 * @function getFileListURL
 * @param {{baseUrl:String, sessionKey:String}}
 * @returns {String}
 */
export const getFileListURL = ({baseUrl, sessionKey}) =>  validate([baseUrl, sessionKey]) &&
    `${baseUrl}permission-access/query/${sessionKey}`;

/**
 * @function getPostboxURL
 * @param {{baseUrl:String, postboxId:String}}
 * @returns {String}
 */
export const getPostboxURL = ({baseUrl, postboxId}) => validate([baseUrl, postboxId]) &&
    `${baseUrl}permission-access/postbox/${postboxId}`;

/**
 * Check that all the required url parts are supplied
 * @function validate
 * @param {String[]} props[]
 * @returns {Boolean} all properties are valid
 */
const validate = props => {
	if (hasEmptyProps(props)) {
		throw new URLError("Missing URL props in request");
	}
	return true;
};

const hasEmptyProps = props => compact(props).length !== props.length;