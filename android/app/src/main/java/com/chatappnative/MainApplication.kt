package com.chatappnative

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
    object : DefaultReactNativeHost(this) {
      override fun getPackages(): List<ReactPackage> =
        PackageList(this).packages.apply {
          // Nếu có package custom thì thêm ở đây
          add(CameraPackage())
        }

      override fun getJSMainModuleName(): String = "index"

      override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

      override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
    }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      load()
    }

    // 🔔 Tạo Notification Channel cho Android 8+
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        "default_channel",                // ID channel (phải trùng meta-data trong AndroidManifest)
        "Default Notifications",          // Tên hiển thị trong setting
        NotificationManager.IMPORTANCE_DEFAULT
      )
      val manager = getSystemService(NotificationManager::class.java)
      manager.createNotificationChannel(channel)
    }
  }
}
