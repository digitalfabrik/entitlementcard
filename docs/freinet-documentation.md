# Freinet Documentation

We are using Freinet for accessing data about Akzeptanzstellen (for Bayern).
This document describes the APIs we are using or will be using.

## LBE Akzeptanzstellen XML

A single large XML file is hosted at [lbe.bayern.de](https://www.lbe.bayern.de/engagement-anerkennen/ehrenamtskarte/akzeptanzstellen/app-daten.xml):

```
https://www.lbe.bayern.de/engagement-anerkennen/ehrenamtskarte/akzeptanzstellen/app-daten.xml
```
 
The format is not formally specified. The field `p_eak_agentur_id` specifies the Stadt or Landkreis where the Akzeptanzstelle is located or managed.

## Freinet JSON API

The Agenturen are also available through a JSON API:

```
https://freinet-online.de/files/api_bayerische_eak/agenturen.php?accessKey={access_key}
```

The `{access_key}` can be requested from [@maxammann](https://github.com/maxammann).

All Akzeptanzstellen are also available. First get the current "version":

```
https://freinet-online.de/files/api_bayerische_eak/version_info.php?last_version=1
```

The timestamp of the version can be accessed here:

```
https://freinet-online.de/files/api_bayerische_eak/version_info.php?version_timestamp={verisonID}
```

Finally, the Akzeptanzstellen can be fetched through:

```
https://freinet-online.de/files/api_bayerische_eak/download.php?get_file=freinet_online_akzeptanzpartner.json&since_eak_version={VersionsNummer}
```

## Freinet "Google Maps" API

There is an API which delivers all Freinet Agenturen as GeoJSON.
The API endpoint is the following:

```
https://www.freinet-online.de/3rdparty/PHPGoogleMapsFreinet/agenturen_v3.php?bundesland=2&agentur_profil=4&output=geojson
```

Each GeoJSON object contains properties which contain an Agentur ID.

## Freinet "iFrame" API

Data about a specific Agentur (aka. Landkreis/Stadt) is available at:

```
https://freinet-online.de/query/gm/?agid=907&t=1&ds=907
```

