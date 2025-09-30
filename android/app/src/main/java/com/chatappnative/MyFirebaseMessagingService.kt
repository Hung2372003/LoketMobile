package com.chatappnative

import android.app.NotificationChannel
import android.app.NotificationManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Build
import android.widget.RemoteViews
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import kotlinx.coroutines.*
import java.net.URL
import android.app.ActivityManager
import android.content.Context
class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        //if (isAppForeground()) {
            val title = remoteMessage.data["title"]
            val body = remoteMessage.data["body"]
            val avatarUrl = remoteMessage.data["image"]
            val notificationId = remoteMessage.data["notificationId"]?.hashCode() ?: System.currentTimeMillis().toInt()
            val bitmap = avatarUrl?.let { urlToBitmap(it) }
            showCustomNotification(title ?: "", body ?: "", bitmap,notificationId)
       // }
        // Nếu app background/killed thì FCM tự hiển thị notification mặc định
    }

    private fun isAppForeground(): Boolean {
        val activityManager = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val appProcesses = activityManager.runningAppProcesses ?: return false
        val packageName = packageName
        return appProcesses.any { it.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND && it.processName == packageName }
    }
    private fun showCustomNotification(title: String, body: String, avatar: Bitmap?,notificationId:Int) {
        val channelId = "default_channel"
        val notificationManager =
            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Default", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channel)
        }

        // Collapsed
        val collapsedView = RemoteViews(packageName, R.layout.custom_notification)
        collapsedView.setTextViewText(R.id.title, title)
        collapsedView.setTextViewText(R.id.body, body)
        avatar?.let { collapsedView.setImageViewBitmap(R.id.avatar, it) }

        // Big view
        val bigView = RemoteViews(packageName, R.layout.custom_notification_big)
        bigView.setTextViewText(R.id.title, title)
        bigView.setTextViewText(R.id.body, body)
        avatar?.let { bigView.setImageViewBitmap(R.id.avatar, it) }

        val notification = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setCustomContentView(collapsedView)
            .setCustomBigContentView(bigView)
            .setAutoCancel(true)
            .build()

        // Dùng id cố định hoặc dựa trên user/message id
        notificationManager.cancel(notificationId)
        notificationManager.notify(notificationId, notification)
    }

    private fun urlToBitmap(url: String): Bitmap? {
        return try {
            val connection = URL(url).openStream()
            BitmapFactory.decodeStream(connection)
        } catch (e: Exception) {
            null
        }
    }
}

