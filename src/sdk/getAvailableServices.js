import { getServicesURL } from "../constants/urlPaths"
import { request } from "./request"

export const getAvailableServices = async (sdkConfig, contractId) => {
    return await request.func.get(getServicesURL, sdkConfig, {}, contractId);
}