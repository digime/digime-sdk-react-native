import {getServicesURL} from "../../constants/urlPaths";
import {request} from "../http/request";
import {omit} from "lodash";
import { sdkConfig, getAvailableServicesProps, getAvailableServicesResponse } from "../../definitions/defs";


/**
 * Removes unused props from the available services api call
 * @function formatAvailableServices
 * @param {*} data
 * @returns
 */
const formatAvailableServices = data => {
	const {
		services,
		...rest
	} = data;

	return {
		services: removeRedundantProps(services),
		...rest
	};
};

/**
 * Remove redundant fields from service objects which aren't
 * required externally. Fields such as 'platform', 'serviceId' etc
 * @function removeRedundantProps
 * @param {Array} service
 * @returns {Array}
 */
const removeRedundantProps = service => {
	const removeProps = [
		"authorisation",
		"platform",
		"providerId",
		"reference",
		"serviceId",
		"sync"
	];

	return service.map(subService => omit(subService, removeProps));
};

/**
 * Returns all available services for a given contract id
 * @async
 * @function getAvailableServices
 * @param {sdkConfig} sdkConfig
 * @param {getAvailableServicesProps} props
 * @returns {Promise<getAvailableServicesResponse>}
 */
export const getAvailableServices = async (sdkConfig, props) => {
	// 'data:{services, ...}' is return from the api
	// extract the data node and pass through
	const {data:{data}} = await request.func.get(getServicesURL, sdkConfig, {}, props.contractId);
	return formatAvailableServices(data);
};
