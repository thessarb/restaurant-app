# restaurant-app

```
npm install -g @ionic/cli@latest
ionic integrations enable capacitor
ionic serve
```
# Generate app assets (icon, splash screen, etc.)
`npx capacitor-assets generate`

# Automatically build the assets and sync the app to the test device
```
npm run android
npm run ios
```



## AndroidManifest.xml
```
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="usarestaurant.tech" />
</intent-filter>
```


## ios
info.plist
line 24 paste
```
<key>NSCameraUsageDescription</key>
<string>This app requires camera access to scan QR codes.</string>
```
