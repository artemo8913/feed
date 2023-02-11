docker rm -f admin
docker build --progress=plain -t admin .
docker run -it --name admin -p 4301:4301 -p 3000:3000 -p 8080:80 admin
