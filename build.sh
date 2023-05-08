docker rm -f admin
docker build \
    --progress=plain \
    --build-arg API_URL=http://localhost:8080/oldapi \
    --build-arg NEW_API_URL=http://localhost:4000 \
    -t admin \
    .
docker run -it --name admin -p 4301:4301 -p 3000:3000 -p 4000:4262 -p 8080:80 admin
