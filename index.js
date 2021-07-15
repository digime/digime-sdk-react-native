/**
 * digi.me React-Native SDK
 */
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import {getAuthorizeUrl} from './src/sdk/functions/authorise';
import * as NativeDeepLinking from './src/sdk/deepLinking';
import { getAvailableServices } from './src/sdk/functions/getAvailableServices';
import { readSession } from './src/sdk/functions/readSession';
import { exchangeCodeForToken } from './src/sdk/functions/exchangeCode';
import { getOnboardServiceUrl } from './src/sdk/functions/getOnboardServices';
import { addTrailingSlash } from './src/utils/url';
import { readAllFiles } from './src/sdk/functions/readAllFiles';
import { readFile } from './src/sdk/functions/readFile';
import { readFileList } from './src/sdk/functions/readFileList';

export const appLinking = {
    init: NativeDeepLinking.init,
    openUrl: NativeDeepLinking.openUrl
}

export const init = config => {
    config = config || {};

    let formatted = {
        ...config,
    };

    if (config.baseUrl) {
        formatted = {
            ...formatted,
            baseUrl: addTrailingSlash(config.baseUrl),
        }
    }

    if (config.onboardUrl) {
        formatted = {
            ...formatted,
            onboardUrl: addTrailingSlash(config.onboardUrl),
        }
    }

    // underlay defaults
    const sdkConfig = {
        autoRedirect: true,
        sleepPollingMS: 3000,
        baseUrl: "https://api.digi.me/v1.6/",
        onboardUrl: "https://api.digi.me/apps/saas/",
        retryOptions: {
            retries: 5,
        },
        ...formatted,
    };

    return {
        getAuthorizeUrl: (props) => getAuthorizeUrl(props, sdkConfig),
        getOnboardServiceUrl: (props) => getOnboardServiceUrl(props, sdkConfig),
        exchangeCodeForToken: (props) => exchangeCodeForToken(props, sdkConfig),
        write: (props) => write(props, sdkConfig),
        readSession: (props) => readSession(props, sdkConfig),
        deleteUser: (props) => deleteUser(props, sdkConfig),
        getAvailableServices: (contractId) => getAvailableServices(sdkConfig, contractId),
        readFile: (props) => readFile(props, sdkConfig),
        readFileList: (props) => readFileList(props, sdkConfig),
        readAllFiles: (props) => readAllFiles(props, sdkConfig),
        readAccounts: (props) => readAccounts(props, sdkConfig),
    }

}
