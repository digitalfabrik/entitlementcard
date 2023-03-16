# Postal code region assignment

For application form we need a mapping of the postal code and the region identifier to find the responsible region for the application. 

# Update CSV file

1. Download the CSV file here: https://downloads.suche-postleitzahl.org/v2/public/zuordnung_plz_ort.csv
2. Remove now the unneeded entries. Open with excel and filter for Bundesland != "Bayern" and delete the unneeded region entries.
3. Remove unneeded columns. We only need `ags` (regionIdentifier) and `plz`
4. Rename the file to `plz_ort_bayern.csv`
5. Move the file to `/backend/src/main/resources/import`
6. Start backend and administration and check if the assigment is still working by typing in a postal code

