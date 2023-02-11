# syntax=docker/dockerfile:experimental

FROM node:18-alpine as base

ENV NODE_ENV=production
ENV husky_skip_init="1"
ENV HUSKY_DEBUG="1"
#ENV NODE_OPTIONS="--max_old_space_size=4000 --openssl-legacy-provider"
ENV NODE_OPTIONS="--max_old_space_size=4000"

#TODO review env varables

ARG HOST
ENV HOST=${HOST}

ARG CI
ENV CI_ENV=${CI}

WORKDIR /app

FROM base as builder

RUN apk add --no-cache curl python3
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN echo "yarn cache clean --force && node-prune" > /usr/local/bin/node-clean && chmod +x /usr/local/bin/node-clean

ENV YARN_CACHE_FOLDER=/root/.yarn

#COPY .. ./

#RUN node -v
#RUN cat /etc/ssl/openssl.cnf
#RUN echo "[provider_sect] \
#default = default_sect \
#legacy = legacy_sect \
#[default_sect] \
#activate = 1 \
#[legacy_sect] \
#activate = 1" >> /etc/ssl/openssl.conf
#RUN exit 1

COPY nginx.conf /app/

COPY ./package.json yarn.lock ./
COPY ./packages/admin/package.json packages/admin/package.json
COPY ./packages/admin/next-i18next.config.mjs packages/admin/next-i18next.config.mjs
COPY ./packages/api/package.json packages/api/package.json
COPY ./packages/core/package.json packages/core/package.json
COPY ./packages/ui/package.json packages/ui/package.json

RUN --mount=type=cache,sharing=locked,target=/root/.yarn \
    --mount=type=cache,sharing=locked,target=/app/packages/admin/node_modules/.cache \
    --mount=type=cache,sharing=locked,target=/app/packages/core/node_modules/.cache \
    --mount=type=cache,sharing=locked,target=/app/packages/ui/node_modules/.cache \
    --mount=type=cache,sharing=locked,target=/app/packages/api/node_modules/.cache \
    yarn --production=false --frozen-lockfile

COPY .. ./

RUN --mount=type=cache,sharing=locked,target=/root/.yarn \
    --mount=type=cache,sharing=locked,target=/app/packages/admin/node_modules/.cache \
    --mount=type=cache,sharing=locked,target=/app/packages/core/node_modules/.cache \
    --mount=type=cache,sharing=locked,target=/app/packages/ui/node_modules/.cache \
    --mount=type=cache,sharing=locked,target=/app/packages/api/node_modules/.cache \
    yarn build

RUN --mount=type=cache,sharing=locked,target=/root/.yarn \
    --mount=type=cache,sharing=locked,target=/app/packages/admin/node_modules/.cache \
    --mount=type=cache,sharing=locked,target=/app/packages/core/node_modules/.cache \
    --mount=type=cache,sharing=locked,target=/app/packages/ui/node_modules/.cache \
    --mount=type=cache,sharing=locked,target=/app/packages/api/node_modules/.cache \
    yarn --production=true --frozen-lockfile

RUN /usr/local/bin/node-clean


FROM base as runner

EXPOSE 3000
EXPOSE 4301
EXPOSE 80

RUN apk add --no-cache nginx
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/node_modules /app/node_modules

COPY --from=builder /app/postcss.config.js /app/
COPY --from=builder /app/tsconfig.json /app/
COPY --from=builder /app/tsconfig.paths.json /app/
COPY --from=builder /app/package.json /app/

COPY --from=builder /app/packages/ui/package.json /app/packages/ui/
COPY --from=builder /app/packages/api/package.json /app/packages/api/
COPY --from=builder /app/packages/core/package.json /app/packages/core/
COPY --from=builder /app/packages/admin/next-i18next.config.mjs /app/packages/admin/
COPY --from=builder /app/packages/admin/next.config.mjs /app/packages/admin/
COPY --from=builder /app/packages/admin/.next/ /app/packages/admin/.next/
COPY --from=builder /app/packages/api/dist/ /app/packages/api/dist/
COPY --from=builder /app/packages/api/tsconfig.json /app/packages/api/
COPY --from=builder /app/nginx.conf /etc

COPY --from=builder /app/entry.sh /app

ENTRYPOINT ["/app/entry.sh"]
