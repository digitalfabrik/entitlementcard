# Setup of staging environment

If you want o make the staging environment available on (api|vector).ehrenamtskarte.app, then the following nginx config can be used on the host:

```nginx configuration
server {
    server_name tiles.staging.ehrenamtskarte.app;

    location / {
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:5002/;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/ehrenamtskarte.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ehrenamtskarte.app/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    server_name tiles.staging.ehrenamtskarte.app;

    location / {
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:5002/;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/ehrenamtskarte.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ehrenamtskarte.app/privkey.pem; 
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    server_name staging.ehrenamtskarte.app;
	root /var/www/html;


	index index.html index.htm index.nginx-debian.html;
	
	listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/ehrenamtskarte.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ehrenamtskarte.app/privkey.pem; 
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
    if ($host = tiles.staging..ehrenamtskarte.app) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name tiles.staging..ehrenamtskarte.app;
    return 404;
}
```

The certificates can be created by using a wildcard certificate:
```bash
certbot certonly --manual  --preferred-challenges=dns -d "*.ehrenamtskarte.app" -d "ehrenamtskarte.app"
```

After starting `docker-compose` with the stagin configuration, the setup should be available at port 80: `docker-compose -f docker-compose.yml -f docker-compose.staging.yml up`.
