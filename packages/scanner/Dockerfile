FROM node:17 as builder

ENV YARN_CACHE_FOLDER=/root/.yarn
ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --production=false --frozen-lockfile

COPY ./pwa-ver.txt /

COPY ./ ./
RUN yarn build


FROM nginx:alpine as runner

EXPOSE 80
WORKDIR /app

COPY nginx.conf /etc/nginx/

COPY --from=builder /app/build /app

CMD ["nginx"]