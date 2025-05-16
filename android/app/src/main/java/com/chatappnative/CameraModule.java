package com.chatappnative;

import android.app.Activity;
import android.content.Intent;
import android.provider.MediaStore;
import android.net.Uri;
import android.os.Environment;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.*;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CameraModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final int CAMERA_REQUEST = 1001;
    private Promise cameraPromise;
    private Uri photoUri;

    public CameraModule(ReactApplicationContext context) {
        super(context);
        context.addActivityEventListener(this);
    }

    @NonNull
    @Override
    public String getName() {
        return "CameraModule";
    }

    @ReactMethod
    public void openCamera(Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("ACTIVITY_NULL", "No activity attached");
            return;
        }

        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        File photoFile;

        try {
            photoFile = createImageFile();
        } catch (IOException e) {
            promise.reject("FILE_ERROR", "Failed to create file");
            return;
        }

        photoUri = FileProvider.getUriForFile(
                activity,
                activity.getPackageName() + ".provider",
                photoFile
        );
        intent.putExtra(MediaStore.EXTRA_OUTPUT, photoUri);

        cameraPromise = promise;
        activity.startActivityForResult(intent, CAMERA_REQUEST);
    }

    private File createImageFile() throws IOException {
        String fileName = "IMG_" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        File storageDir = getReactApplicationContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        return File.createTempFile(fileName, ".jpg", storageDir);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode == CAMERA_REQUEST && cameraPromise != null) {
            if (resultCode == Activity.RESULT_OK) {
                cameraPromise.resolve(photoUri.toString());
            } else {
                cameraPromise.reject("CANCELLED", "User cancelled");
            }
            cameraPromise = null;
        }
    }

    @Override
    public void onNewIntent(Intent intent) {}
}
