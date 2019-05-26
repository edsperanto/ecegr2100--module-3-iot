const io = require('socket.io-client');
const Gpio = require('onoff').Gpio;

const LED = new Gpio(23, 'out');

var blinkInterval = setInterval(blinkLED, 250);

function blinkLED() {
    if (LED.readSync() === 0) {
        LED.writeSync(1);
    } else {
        LED.writeSync(0);
    }
}

function endBlink() {
    clearInterval(blinkInterval);
    LED.writeSync(0);
    LED.unexport();
}

setTimeout(endBlink, 5000);
