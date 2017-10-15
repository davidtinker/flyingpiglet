const Gpio = require('onoff').Gpio;
const { exec } = require('child_process');

let picOffTimeout;
let tvState = 0;

const tvControl = (on) => {
    console.log("tvControl " + on);
    if (on != tvState) {
        exec('/usr/bin/irsend SEND_ONCE SINO_TV KEY_POWER');
        tvState = on;
    }
};

const turnOnTvWithAutoOff = () => {
    console.log("turning on TV wih auto off after 10 mins");
    if (picOffTimeout) clearTimeout(picOffTimeout);
    else tvControl(1);
    picOffTimeout = setTimeout(() => {
        tvControl(0);
        picOffTimeout = null;
    }, 10 * 60 * 1000);
};

turnOnTvWithAutoOff();

new Gpio(4, 'in', 'both').watch((err, value) => {
    console.log("motion pin change " + value);
    if (value) turnOnTvWithAutoOff();
});