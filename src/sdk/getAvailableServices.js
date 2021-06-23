import { getServices } from "../constants/urlPaths"
import { request } from "./request"

export const getAvailableServices = async (sdkConfig, contractId) => {
    return await request.func.get(getServices, sdkConfig, {}, contractId);
}