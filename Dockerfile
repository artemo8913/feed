# syntax=docker/dockerfile:experimental

FROM node:18-alpine as base

ENV NODE_ENV=production
ENV husky_skip_init="1"
ENV HUSKY_DEBUG="1"
ENV NODE_OPTIONS="--max_old_space_size=4000 --openssl-legacy-provider"

#TODO review env varables

ARG HOST
ENV HOST=${HOST}

ARG CI
ENV CI_ENV=${CI}

WORKDIR /app

FROM base as builder

RUN apk add --no-cache curl
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN echo "yarn cache clean --force && node-prune" > /usr/local/bin/node-clean && chmod +x /usr/local/bin/node-clean

#RUN echo 'registry "https://nexus/repository/npm-front/" \
#          always-auth true' > ~/.yarnrc

ENV YARN_CACHE_FOLDER=/root/.yarn

COPY ./package.json yarn.lock ./
COPY ./packages/admin/package.json packages/admin/package.json
COPY ./packages/api/package.json packages/api/package.json
COPY ./packages/api/package.json packages/ui/package.json

RUN --mount=type=cache,sharing=locked,target=/root/.yarn \
    --mount=type=cache,sharing=locked,target=/app/packages/admin/node_modules/.cache \
    --mount=type=cache,sharing=locked,target=/app/packages/api/node_modules/.cache \
     yarn --production=false --frozen-lockfile

COPY .. ./

RUN --mount=type=cache,sharing=locked,target=/root/.yarn \
    --mount=type=cache,sharing=locked,target=/app/packages/admin/node_modules/.cache \
    --mount=type=cache,sharing=locked,target=/app/packages/api/node_modules/.cache \
    yarn build

RUN --mount=type=cache,sharing=locked,target=/root/.yarn \
    yarn --production=true --frozen-lockfile

RUN /usr/local/bin/node-clean


FROM base as runner

RUN apk add --no-cache nginx
COPY nginx.conf /etc/nginx/nginx.conf

#COPY --from=builder /app/node_modules/ /app/node_modules/xargs  kubectl delete -n <namespace> pod
COPY --from=builder /app/postcss.config.js /app/
COPY --from=builder /app/tsconfig.json /app/
COPY --from=builder /app/tsconfig.paths.json /app/
COPY --from=builder /app/package.json /app/

COPY --from=builder /app/packages/admin/next.config.mjs /app/packages/admin/
COPY --from=builder /app/packages/admin/.next/ /app/packages/admin/.next/
COPY --from=builder /app/packages/api/dist/ /app/packages/api/dist/

COPY --from=builder /app/entry.sh /app
