# Setup of staging environment

## Setup of host nginx and HTTPs

If you want o make the staging environment available on (api|tiles).ehrenamtskarte.app, then the following nginx config can be used on the host:

```nginx configuration
# Nginx config which tls support for staging environment. Forwards requests to reverse proxy inside the docker network.
# The config used in that reverse proxy can be nginx-development.conf or nginx-staging.conf.

server {
    server_name tiles.staging.ehrenamtskarte.app;

    location / {
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:5002/;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/staging.ehrenamtskarte.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.ehrenamtskarte.app/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    server_name api.staging.ehrenamtskarte.app;

    location / {
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:5002/;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/staging.ehrenamtskarte.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.ehrenamtskarte.app/privkey.pem; 
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    server_name staging.ehrenamtskarte.app;
	root /var/www/html;


	index index.html index.htm index.nginx-debian.html;
	
	listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/staging.ehrenamtskarte.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.ehrenamtskarte.app/privkey.pem; 
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = staging.ehrenamtskarte.app) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name staging.ehrenamtskarte.app;
    return 404;
}

server {
    if ($host = api.staging.ehrenamtskarte.app) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name api.staging.ehrenamtskarte.app;
    return 404;
}

server {
    if ($host = tiles.staging.ehrenamtskarte.app) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name tiles.staging.ehrenamtskarte.app;
    return 404;
}
```

The certificates can be created by using a wildcard certificate:
```bash
certbot certonly --manual  --preferred-challenges=dns -d "*.ehrenamtskarte.app" -d "ehrenamtskarte.app"
```

## Download Font Glyphs

The font glyphs are not part of this repository and need to be downloaded manually:

```bash
cd map-tiles/styles
wget https://github.com/orangemug/font-glyphs/archive/gh-pages.zip
unzip gh-pages.zip
mv font-glyphs-gh-pages font-glyphs
```

## Starting the Services

After starting `docker-compose` with the staging configuration, the setup should be available at port 80: `docker-compose -f docker-compose.yml -f docker-compose.staging.yml up`.

## Importing EAK data on staging

To import the EAK data using docker, run the following:

```bash
docker exec -it $(docker ps -q --filter name=ehrenamtskarte_backend_1) bash -c 'BACKEND_OPTS="-Dapp.postgres.url=jdbc:postgresql://db-postgis:5432/ehrenamtskarte -Dapp.postgres.user=postgres -Dapp.postgres.password=postgres -Dapp.import.xml=https://www.lbe.bayern.de/engagement-anerkennen/ehrenamtskarte/akzeptanzstellen/app-daten.xml" /backend/bin/backend --import'
```
