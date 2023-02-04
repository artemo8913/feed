echo ${YA_DISK_TOKEN}

/opt/ydcmd/ydcmd.py --token=${YA_DISK_TOKEN} put /upload/app-debug.apk /ins/
/opt/ydcmd/ydcmd.py --token=${YA_DISK_TOKEN} put /upload/app-release-unsigned.apk /ins/
