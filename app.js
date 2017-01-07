var fs = require('fs');
var exec = require('child_process').exec;
var SerialPort = require("serialport").SerialPort;

var tagsFile = fs.readFileSync('tags.txt');
var tags = JSON.parse(tagsFile);

var sp = new SerialPort("/dev/hidraw0");

sp.on('open', function() {
  sp.on('data', function(buf) {

    var dir = buf[1];
    var len = buf[4];

    if (len == 0) return;

    var addr = buf.readInt32LE(5);
    var addrHex = addr.toString(16);
    var track = tags[addrHex];

    console.log('dir: ' + dir);
    console.log('len: ' + len);
    console.log('addr: ' + addrHex);
    console.log('track: ' + track);

    var cmd;
    if (dir == 1) cmd = 'mpc clear; mpc add \"Local media\"; mpc play ' + track;
    if (dir == 2) cmd = 'mpc clear; mpc add \"Local media\"; mpc stop';

    console.log('running ' + cmd);

    exec(cmd, function(error, stdout, stderr) {
      console.log(stdout);
    });
  });
});
