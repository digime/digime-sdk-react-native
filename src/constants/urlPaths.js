import { compact } from "lodash";
import { URLError } from "../sdk/errors/errors";

export const getPrivateShareGuestURL = (baseUrl, sessionKey, callbackUrl) => `${baseUrl}/apps/quark/v1/direct-onboarding?sessionExchangeToken=${sessionKey}&callbackUrl=${callbackUrl}`;

export const getSessionURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}permission-access/session`;

export const getOauthURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}oauth/authorize`;

export const getOauthTokenURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}oauth/token`;

export const getAuthURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}authorize`;

export const getTriggerURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}permission-access/trigger`;

export const getServicesURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}discovery/services`;

export const getTokenReferenceURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}oauth/token/reference`;

export const getServiceOnboardURL = ({baseUrl}) => validate([baseUrl]) &&
    `${baseUrl}onboard`;

export const getFileURL = ({baseUrl, sessionKey, fileName}) => validate([baseUrl, sessionKey, fileName]) &&
    `${baseUrl}permission-access/query/${sessionKey}/${fileName}`;

export const getFileListURL = ({baseUrl, sessionKey}) =>  validate([baseUrl, sessionKey]) &&
    `${baseUrl}permission-access/query/${sessionKey}`;


/**
 * Check that all the required url parts are supplied
 * @param {*} props[]
 * @returns Boolean
 */
const validate = props => {
	if (hasEmptyProps(props)) {
		throw new URLError("Missing URL props in request");
	}
	return true;
};

const hasEmptyProps = props => compact(props).length !== props.length;