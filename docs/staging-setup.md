# Setup of staging environment

If you want o make the staging environment available on vector.ehrenamtskarte.app, then the following nginx config can be used on the host:

```nginx configuration
server {
    server_name vector.ehrenamtskarte.app;

    location / {
        proxy_pass http://127.0.0.1:5002/;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/ehrenamtskarte.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ehrenamtskarte.app/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    server_name api.ehrenamtskarte.app;

    location / {
        proxy_pass http://127.0.0.1:5002/;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/ehrenamtskarte.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ehrenamtskarte.app/privkey.pem; 
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}


server {
    if ($host = vector.ehrenamtskarte.app) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name vector.ehrenamtskarte.app;
    return 404;
}
```

After starting `docker-compose` with the stagin configuration, the setup should be available at port 80: `docker-compose -f docker-compose.yml -f docker-compose.staging.yml up`.
