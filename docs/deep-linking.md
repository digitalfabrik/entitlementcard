# Deep Linking

We use deep linking to simplify the card activation for the user.

## Schemes

### 1. Https

This scheme has a trust association to our server and only works if `assetlinks.json` and `apple-app-site-association` files are properly deployed on our webserver.
We need this scheme because some mail clients and pdf readers can not resolve a custom scheme.
Please note that we only have one web application for all projects and the `ProjectConfig` is depending on the url. 
So in nginx redirects are configured for each project to reach the particular association file:

#### Example
`https://staging.bayern.ehrenamtskarte.app/.well-known/assetlinks.json` -> `bayern/assetlinks.json`


### 2. Custom scheme

The custom scheme is project dependent. It is used for local testing and deep links that have to be opened in the browser if `https` scheme is not working.
Custom scheme deep links have a better browser compatibility than https deep links.

## ActivationLink

The card activation links will be printed on the pdf,send via mail or accessible via self service portal. It's important that the `activationCode` is uriEncoded.

### Examples:

```
https://staging.bayern.ehrenamtskarte.app/activation/code#ClcKLQoNRGVlcGxpbmsgVGVzdBCWnQEaGAoCCF0SAwiIORoHCLPPvgEQASoECKiaARIQBuTHyi60o6UC2U439XGLMRoUBzxIAa%2BPG%2Bj%2FIrBzJVTJACh21KA%3D

ehrenamtbayern://bayern.ehrenamtskarte.app/activation/code#ClcKLQoNRGVlcGxpbmsgVGVzdBCWnQEaGAoCCF0SAwiIORoHCLPPvgEQASoECKiaARIQBuTHyi60o6UC2U439XGLMRoUBzxIAa%2BPG%2Bj%2FIrBzJVTJACh21KA%3D
koblenzpass://koblenz.sozialpass.app/activation/code#ClcKLQoNRGVlcGxpbmsgVGVzdBCWnQEaGAoCCF0SAwiIORoHCLPPvgEQASoECKiaARIQBuTHyi60o6UC2U439XGLMRoUBzxIAa%2BPG%2Bj%2FIrBzJVTJACh21KA%3D
```

#### Note
These activation codes are local and won't work on real devices.
We use a `fragment (code#)` for the activation code to avoid sending user data to the server 

## Testing

Install: `npm i -g uri-scheme` if you want to use the simplified command

### a) Android

#### Note
For android trusted associations, which are required for https schemes, only work with signed apks out of the box.
For local testing you have to install the app and add these domains manually.
- AppSettings -> OpenByDefault -> AddLinks -> enable supported links

```
npx uri-scheme open https://staging.nuernberg.sozialpass.app/activation/code#<activationCode> --android
```


### b) iOS
```
npx uri-scheme open https://staging.nuernberg.sozialpass.app/activation/code#<activationCode> --ios
```



