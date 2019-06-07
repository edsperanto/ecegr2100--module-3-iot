const io = require('socket.io-client');

const socket = io("https://edwardgao.com");

socket.on('connect', _ => {
    console.log("Socket ID:", socket.id);
});

const Gpio = require('onoff').Gpio;

const useLed = (led, value) => led.writeSync(value);

let led;

if(Gpio.accessible) {
    led = new Gpio(17, "out");
    console.log("accessible");
} else {
    led = {
        writeSync: value => {
            console.log("virtual led now uses value: " + value);
        }
    }
}

useLed(led, 1);
