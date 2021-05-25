
# react-native-tes

## Getting started

`$ npm install react-native-tes --save`

### Mostly automatic installation

`$ react-native link react-native-tes`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-tes` and add `RNTes.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNTes.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNTesPackage;` to the imports at the top of the file
  - Add `new RNTesPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-tes'
  	project(':react-native-tes').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-tes/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-tes')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNTes.sln` in `node_modules/react-native-tes/windows/RNTes.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Tes.RNTes;` to the usings at the top of the file
  - Add `new RNTesPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNTes from 'react-native-tes';

// TODO: What to do with the module?
RNTes;
```
  