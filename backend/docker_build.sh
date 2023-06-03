echo "Start build"
. .env

#cp /etc/ssl/certs/ca-certificates.crt ./

docker build -t $IMAGE_NAME  .
