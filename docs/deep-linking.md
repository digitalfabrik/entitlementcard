# Deep Linking

We use deep linking to simplify the card activation for the user.

## Schemes

### 1. Https

This scheme has a trust association to our server and only works if `assetlinks.json` and `apple-app-site-association` files are properly deployed on our webserver.
We need this scheme because some mail clients can not resolve custom scheme if we send activation links via mail.
Mind that we only have one web application for all projects and the `ProjectConfig` is depending on the url. 
So in nginx are redirects configured for each project to reach the particular association file:

#### Example
`https://staging.bayern.ehrenamtskarte.app/.well-known/assetlinks.json` -> `bayern/assetlinks.json`


### 2. Custom scheme

This scheme is basically used for local testing and can also be used as a fallback if `https` scheme is not working.

## ActivationLink

The card activation links will be printed on the pdf or send via mail. It's important that the `activationCode` is uriEncoded and has a trailing slash.

### Examples:

```
https://staging.bayern.ehrenamtskarte.app/activation/code#ClcKLQoNRGVlcGxpbmsgVGVzdBCWnQEaGAoCCF0SAwiIORoHCLPPvgEQASoECKiaARIQBuTHyi60o6UC2U439XGLMRoUBzxIAa%2BPG%2Bj%2FIrBzJVTJACh21KA%3D/

berechtigungskarte://bayern.ehrenamtskarte.app/activation/code#ClcKLQoNRGVlcGxpbmsgVGVzdBCWnQEaGAoCCF0SAwiIORoHCLPPvgEQASoECKiaARIQBuTHyi60o6UC2U439XGLMRoUBzxIAa%2BPG%2Bj%2FIrBzJVTJACh21KA%3D/
```

#### Note
This activation codes are local and won't work on real devices.
We use a `fragment (code#)` for the activation code to avoid sending user data to the server 

## Testing

### a) Android
```
adb shell am start -a android.intent.action.VIEW \
-c android.intent.category.BROWSABLE \
-d https://bayern.ehrenamtskarte.app/activation/code#<activationCode>/
```

### Note
For android only signed apks can apply trusted associations. So if you want to test `https` scheme on android, you have to build a signed apk e.g. a release apk.

### a) iOS
```
xcrun simctl openurl booted https://staging.nuernberg.sozialpass.app/activation/code#<activationCode>/
```

