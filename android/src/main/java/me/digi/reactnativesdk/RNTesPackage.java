package me.digi.reactnativesdk;

import java.lang.annotation.Native;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.JavaScriptModule;

import com.bitgo.randombytes.RandomBytesPackage;
import com.proyecto26.inappbrowser.RNInAppBrowserModule;

public class RNTesPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        // Add RandomBytes native modules - the RandomBytesModule isn't a public class
        // so we have to add via the public package first, which returns
        // an array of modules, essentially one, that we need to add
        RandomBytesPackage rnPackage = new RandomBytesPackage();
        List<NativeModule> rnModules = rnPackage.createNativeModules(reactContext);

        // Add other modules that are required
        // here we add the InAppBrowser module
        List<NativeModule> modules = new ArrayList<NativeModule>();
        modules.add(new RNInAppBrowserModule(reactContext));

        // combine lists
        List<NativeModule> allModules = new ArrayList<NativeModule>();
        allModules.addAll(rnModules);
        allModules.addAll(modules);

      return allModules;
    }

    // Deprecated from RN 0.47
    public List<Class<? extends JavaScriptModule>> createJSModules() {
      return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
      return Collections.emptyList();
    }
}