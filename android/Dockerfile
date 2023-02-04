FROM mingc/android-build-box:latest as builder

WORKDIR /build

COPY . /build

RUN --mount=type=cache,sharing=locked,target=/root/.gradle \
    --mount=type=cache,sharing=locked,target=/build/.gradle \
    --mount=type=cache,sharing=locked,target=/build/app/build \
    ./gradlew build


FROM python:alpine3.17 as uploader

WORKDIR /opt

RUN apk add --no-cache git
RUN pip install --upgrade pip
RUN pip install python-dateutil

RUN git clone https://github.com/abbat/ydcmd.git

WORKDIR /upload

COPY ./upload.sh .

COPY --from=builder /build/app/build/outputs/apk/debug/app-debug.apk .
COPY --from=builder /build/app/build/outputs/apk/release/app-release-unsigned.apk .

RUN /upload/upload.sh

CMD [ "/upload/upload.sh" ]

