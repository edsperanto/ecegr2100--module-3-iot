var io = require("socket.io-client");
var socket = io("https://edwardgao.com");
var Gpio = require("onoff").Gpio;
var exec = require("child_process").exec;

var redLED = new Gpio(27, "out");
var blueLED = new Gpio(23, "out");

var cops = {"red": null, "blue": null}

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
                if(floppySerial == userSerial && userSerial != "") {
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

socket.on("control", type => {
    console.log("Command:", type);
    function stopCops() {
        if(!!cops.red) {
            clearInterval(cops.red);
            cops.red = null;
        }
        if(!!cops.blue) {
            clearInterval(cops.blue);
            cops.blue = null;
        }
    }
    if(type == "open door") {
        var doorlock = new Gpio(17, "out");
        doorlock.writeSync(1);
        setTimeout(_ => doorlock.writeSync(0), 1000);
        setTimeout(_ => doorlock.unexport(), 1200);
    } else if(type == "red pill") {
        stopCops();
        redLED.writeSync(redLED.readSync() ^ 1);
    } else if(type == "blue pill") {
        stopCops();
        blueLED.writeSync(blueLED.readSync() ^ 1);
    } else if(type == "shut down") {
        stopCops();
        redLED.writeSync(0);
        blueLED.writeSync(0);
    } else if(type == "wee woo") {
        stopCops();
        redLED.writeSync(1);
        blueLED.writeSync(0);
        cops.red = setInterval(_ => redLED.writeSync(redLED.readSync() ^ 1), 100);
        cops.blue = setInterval(_ => blueLED.writeSync(blueLED.readSync() ^ 1), 100);
    }
});
