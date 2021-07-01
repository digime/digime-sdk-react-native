import {getServicesURL} from "../../constants/urlPaths"
import {request} from "../request"
import {omit} from "lodash";

const formatAvailableServices = data => {
    const {
        data: {
            services,
            ...rest
        }
    } = data;

    return {
        services: removeRedundantProps(services),
        ...rest
    }
}

// Remove redundant fields from service objects
const removeRedundantProps = service => {
    const removeProps = [
        "authorisation",
        "platform",
        "providerId",
        "reference",
        "serviceId",
        "sync"
    ]

    return service.map(subService => omit(subService, removeProps));
};

export const getAvailableServices = async (sdkConfig, contractId) => {
    const data = await request.func.get(getServicesURL, sdkConfig, {}, contractId);
    return formatAvailableServices(data);
}
