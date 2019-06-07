const Gpio = require('onoff').Gpio;
const doorlock = new Gpio(17, 'out');
const redLED = new Gpio(27, 'out');
const blueLED = new Gpio(23, 'out');
 
const iv = setInterval(_ => doorlock.writeSync(doorlock.readSync() ^ 1), 1000);
const redCops = setInterval(_ => redLED.writeSync(redLED.readSync() ^ 1), 100);
const blueCops = setInterval(_ => blueLED.writeSync(blueLED.readSync() ^ 1), 100);

redLED.writeSync(1);
blueLED.writeSync(0);

setTimeout(_ => {
    clearInterval(iv);
    doorlock.unexport();
}, 10000);

setTimeout(_ => {
    clearInterval(redCops);
    clearInterval(blueCops);
    redLED.unexport();
    blueLED.unexport();
}, 10000);
