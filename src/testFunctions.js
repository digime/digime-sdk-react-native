import {ToastAndroid} from "react-native"

export const log = status => {
    ToastAndroid.show(status, ToastAndroid.SHORT)
}