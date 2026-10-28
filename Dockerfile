# Runtime-only image: nginx serving the already-built site.
#
# The build deliberately happens in CI, not here. Building inside the image would
# need the private verificahub-docs repo cloned in (docs, i18n and the OpenAPI
# spec all live there) plus the DocSearch credentials — a token and three secrets
# inside a Docker build, to produce exactly what CI already produces one step
# earlier. So CI builds and this image only packages `build/`.
FROM nginx:1.27-alpine AS run

# Replace the stock server block with ours (trailing-slash routing + caching).
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/app.conf
COPY build /usr/share/nginx/html

EXPOSE 80
# The base image's CMD already runs `nginx -g 'daemon off;'` in the foreground.
