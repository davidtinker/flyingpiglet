const Gpio = require('onoff').Gpio;

const pump = new Gpio(17, 'out');
const waterLevelSwitch = new Gpio(4, 'in', 'both');

let timeout;

console.log("Watching water level switch");

waterLevelSwitch.watch((err, value) => {
    console.log("Water level switch pin change " + value);
    if (value) {
        console.log("Turning pump off after 30m delay");
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => pump.writeSync(0), 30 * 60 * 1000)
    } else {    // switch is closed i.e. barrel is full
        console.log("Turning pump on");
        pump.writeSync(1);
    }
});
