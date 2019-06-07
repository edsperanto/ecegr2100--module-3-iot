grepresult="$( ls -l /dev/disk/by-path | grep "usb" )"
if [ -n "$grepresult" ]; then
    diskname="$( echo "$grepresult" | cut -d"/" -f3 )"
    sudo mkdir -p /media/floppy
    sudo mount /dev/$diskname /media/floppy
    cd /media/floppy
    license="$( cat SUPER_SECURE_LICENSE )"
    cd /media
    sudo umount /dev/$diskname
    sudo rmdir /media/floppy
    echo $license
else
    echo "No floppy disks detected"
fi
