
package me.digi.reactnativesdk;

import android.content.Intent;
import android.app.Activity;
import android.content.Context;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ActivityEventListener;

public class RNTesModule extends ReactContextBaseJavaModule implements ActivityEventListener {

  private final ReactApplicationContext reactContext;

  public RNTesModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }


  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    Log.d("SDK", "RTB");
    throw new Error("fudge");
  }

  @Override
  public void onNewIntent(Intent intent) {
    // mandatory override¬
  }

  @ReactMethod
  public void auth() {

    Log.d("SDK", "Auth");
    final Context context = this.reactContext;
    final Activity currentActivity = getCurrentActivity();

    final int REQUEST_CODE = 1;

    //val guestRequestCode = DMEAppCommunicator.getSharedInstance().requestCodeForDeeplinkIntentActionId(R.string.deeplink_guest_consent_callback)
    //Intent proxyLaunchIntent = new Intent(currentActivity);//, GuestConsentBrowserActivity::class.java)


    Intent browserIntent = new Intent(Intent.ACTION_VIEW,Uri.parse("http://www.test.com"));
    currentActivity.startActivityForResult(browserIntent, 2);

    //currentActivity.startActivityForResult(browserIntent, 2);
  }

  @Override
  public String getName() {
    return "RNTes";
  }
}