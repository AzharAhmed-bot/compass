server {
        server_name ***REMOVED***;
	root /compass-calendar/prod/build;
        location / {
		index index.html;
		try_files $uri $uri/ =404;
        }
	location /api {
		# reverse proxy for backend api
		proxy_pass http://localhost:3000/api;
        }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/***REMOVED***/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/***REMOVED***/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = ***REMOVED***) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    server_name ***REMOVED***;
    listen 80;
    return 404; # managed by Certbot
}