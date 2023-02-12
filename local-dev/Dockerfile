FROM nginx:alpine

RUN apk add --no-cache iproute2

ENV HTTPS_METHOD=noredirect

RUN /sbin/ip route | grep default | cut -d ' ' -f 3
