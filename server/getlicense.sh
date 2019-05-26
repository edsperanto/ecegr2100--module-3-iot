floppyuuid="c8df9ed1-6d8e-4a03-bdd2-cc8f8686fb6c"
grepresult="$( ls -l /dev/disk/by-uuid | grep "$floppyuuid" )"
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
fi
