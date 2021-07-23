import {getServicesURL} from "../../constants/urlPaths";
import {request} from "../request";
import {omit} from "lodash";
import "../../definitions/defs";

/**
 * Removes unused props from the available services api call
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

// Remove redundant fields from service objects
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
 * @param {string} contractId
 * @returns
 */
export const getAvailableServices = async (sdkConfig, contractId) => {
	// 'data:{services, ...}' is return from the api
	// extract the data node and pass through
	const {data:{data}} = await request.func.get(getServicesURL, sdkConfig, {}, contractId);
	return formatAvailableServices(data);
};
