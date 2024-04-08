# Sozialpass stores import

Currently we import new stores for sozialpass manually from csv every quarter.
The source file will be provided in nextcloud by the city of nuernberg.
This source file contains addresses which have to be converted to coordinates before they can be used for store import.
The output file will be uploaded to the entitlement server.

1. Enable `geocoding` and `csvWriter` in `/backend/src/resources/config-local.yml`
2. Get the csv file from nextcloud put it into `/backend/src/resources/import` (rename `Akzeptanzpertner-daten.csv`)
3. Start `import data` job. This may take a while.
4. Check the log if entries were filtered out and try to fix them. Check if `acceptingstores` were updated in the database
5. Update repo [sozialpass-nuernberg-data](https://github.com/digitalfabrik/sozialpass-nuernberg-data) with content of csv file of  `src/main/resources/import/nuernberg-akzeptanzstellen_geoinfo.csv`
6. Update the csv file on nextcloud with current geoinfos from the output file.
7. Connect to `ssh <username>@entitlementcard.app`
8. Pull repo `cd /var/www/data && git pull`