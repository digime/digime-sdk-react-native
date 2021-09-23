![](https://securedownloads.digi.me/partners/digime/SDKReadmeBanner.png)
<p align="center">
    <a href="https://developers.digi.me/slack/join">
        <img src="https://img.shields.io/badge/chat-slack-blueviolet.svg" alt="Developer Chat">
    </a>
    <a href="LICENSE">
        <img src="https://img.shields.io/badge/license-apache 2.0-blue.svg" alt="Apache 2.0 License">
    </a>
    <a href="#">
    	<img src="https://img.shields.io/badge/build-passing-brightgreen.svg">
    </a>
    <a href="https://www.javascript.com/">
        <img src="https://img.shields.io/badge/language-javascript-fcdc00.svg" alt="Javascript">
    </a>
    <a href="https://developers.digi.me/">
        <img src="https://img.shields.io/badge/web-digi.me-red.svg" alt="Web">
    </a>
</p>

<br>

# Getting Started

## Requirements
- react-native ^0.64.0

## Installation

Using npm:
```shell
$ npm i @digime/digime-sdk-react-native
```


#### `Android`
Update Gradle Settings
```gradle
    // file: android/settings.gradle
    ...
    File reactSDk = new File(rootProject.projectDir, '../node_modules/digime-sdk-react-native/android')
    include ':reactnativesdk', ':app'
    apply from: new File(reactSDk, '/settings.gradle')
    project(':reactnativesdk').projectDir = reactSDk
```

Add Android Scheme
```xml
    // file: android/app/src/main/AndroidManifest.cml
    <intent-filter>
        ...
        <data android:scheme="example" />
    </intent-filter>
```

## Obtaining your Contract ID, Application ID & Private Key
To access the digi.me platform, you need to obtain an AppID for your application. You can get yours by filling out the registration form [here](https://go.digi.me/developers/register).

In a production environment, you will also be required to obtain your own Contract ID and Private Key from digi.me support. However, for demo purposes, we provide example values. You can find example keys in our [example application](https://github.com/digime/digime-sdk-react-native-example).


## Initializing the SDK
Once you have the above, we can initiate the SDK.

```typescript
import { init } from "@digime/digime-sdk-react-native";
const digimeSDK = init({ applicationId: <my-unique-application-id> });
```

To see all the other options when initializing the SDK, please take a look [here](../fundamentals/initialise-sdk.html).


## Using the SDK
* Use digi.me to [request data from your users](read-data-overview.html).
* Use digi.me to [write data to your users](write-data-overview.html).
* To see all the available functions in the SDK, please take a look [here](../../interfaces/sdk.digimesdk.html).
