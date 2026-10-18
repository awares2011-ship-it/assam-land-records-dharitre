# Baseline rules for a Capacitor app.
# Keep the JavaScript-interface bridge classes (Capacitor wires window
# messages through these at runtime via reflection).
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }

# AndroidX core libs we pull in
-keep class androidx.core.** { *; }
-keep class androidx.appcompat.** { *; }
-keep class androidx.webkit.** { *; }

# Capacitor plugins we ship
-keep class com.capacitorjs.plugins.app.** { *; }
-keep class com.capacitorjs.plugins.browser.** { *; }
-keep class com.capacitorjs.plugins.localnotifications.** { *; }
-keep class com.capacitorjs.plugins.preferences.** { *; }
-keep class com.capacitorjs.plugins.share.** { *; }

# Keep annotated plugin methods (@PluginMethod)
-keepclassmembers class * {
    @com.getcapacitor.annotation.PluginMethod *;
    @com.getcapacitor.PluginMethod *;
}

# Enum reflection used by Capacitor plugin options
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep public views & onClick/onCheckedChanged targets if any native XML
# layouts use them (none right now, but future-proof).
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    public void set*(...);
}

# Drop verbose Capacitor logs in release
-assumenosideeffects class android.util.Log {
    public static *** v(...);
    public static *** d(...);
}
