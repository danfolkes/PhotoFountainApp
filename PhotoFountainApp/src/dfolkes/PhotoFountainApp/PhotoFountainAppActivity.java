package dfolkes.PhotoFountainApp;

/*import android.app.Activity;*/
import android.os.Bundle;
import org.apache.cordova.*;

public class PhotoFountainAppActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("loadUrlTimeoutValue", 60000);
        super.loadUrl("file:///android_asset/www/index.html");
        //setContentView(R.layout.main);
    }
}