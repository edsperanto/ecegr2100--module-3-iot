const io = require("socket.io-client");
const socket = io("https://edwardgao.com");
const Gpio = require("onoff").Gpio;
const exec = require("child_process").exec;

socket.on("connect", _ => {
    console.log("Socket ID:", socket.id);
    socket.emit("identity", "pi");
});

socket.on("reqAuth", data => {
    [email, msg] = data.split(';');
    console.log("Auth requested:", msg);
    exec("bash getlicense.sh", (err, stdout, stderr) => {
        stdout = stdout.split(' ')[0];
        if(err !== null) {
            console.log(`exec error: ${error}`);
        } else {
            if(stdout != "No floppy disks detected") {
                let floppySerial = stdout.split('\n')[0];
                let userSerial = msg.split(' ')[0];
                console.log("floppy:", floppySerial);
                if(floppySerial == userSerial) {
                    socket.emit("piAuth", `${email};success`);
                } else {
                    socket.emit("piAuth", `${email};fail`);
                }
            } else {
                console.log("NO FLOPPY!");
            }
        }
    });
});
