FROM python:alpine3.17

WORKDIR /opt

RUN apk add --no-cache git
RUN pip install --upgrade pip
RUN pip install python-dateutil

RUN git clone https://github.com/abbat/ydcmd.git

RUN /opt/ydcmd/ydcmd.py --token=${YA_DISK_TOKEN} ls /ins

CMD [ "/opt/ydcmd/ydcmd.py", "--token=${YA_DISK_TOKEN}", "ls", "/ins" ]
