import {ToastAndroid} from "react-native"

export const Toast = (message, duration=ToastAndroid.SHORT) => {
    ToastAndroid.show(message, duration);
}