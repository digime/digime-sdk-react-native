
import DeepLinking from 'react-native-deep-linking';

import {
    Linking
} from 'react-native';

const handleUrl = (obj) => {
    console.log('APP OPENED, WAS IN THE BACKGROUND')
    console.log('handleurl ', obj)
    const {url} = obj;
    Linking
        .canOpenURL(url)
        .then((supported) => {
            if (supported) {
                DeepLinking.evaluateUrl(url);
            }
        });
}
export const addRoute = (routeExpression, callback) => {
    DeepLinking.addRoute(routeExpression, callback);
}

export const unload = () => {
    Linking.removeEventListener('url', handleUrl);
}

export const openUrl = async (url) => {
    console.log('opn url', url)
    const canOpen = await Linking.canOpenURL(url)

    if (!canOpen) {
        return false;
    }

    try {
      return await Linking.openURL(url);
    }
    catch (e) {
      console.log(e)
    }
}

export const init = (scheme) => {
    console.log('init deeplinking ', scheme)
    DeepLinking.addScheme(scheme);

    // there are two wats to handle the URLs to open your app;
    // 1, if the app is already open, the app is put into the foreground and a linking event is fired
    // this is handled through the addEventListener
    // 2, if the app is not already open, then the app is opened and the url is passed in as the initialURL
    // this is handed in the getInitialURL function

    // app was in the background, but already open
    Linking.addEventListener('url', handleUrl);

    // app wasn't open
    Linking
        .getInitialURL()
        .then((url) => {
            console.log('APP OPENED, WASN`T RUNNING')
            console.log(url)
            if (url) {
                Linking.openURL(url);
            }
        })
        .catch(err = () => {
            console.error('An error occurred', err);
        });
}