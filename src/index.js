// Serialport's debug capabilities enable/disable
// process.env.DEBUG ="*"

var SerialPort = require('@serialport/stream');
// @brightsign/serialport is supported in OS 8.2.26+, this is replacing the /src/bs-binding.js
var BrightSignBinding = require('@brightsign/serialport');
var ByteLength = require('@serialport/parser-byte-length');

var path = '/dev/ttyS0';

var SerialPortListClass = require("@brightsign/serialportlist");
var serialPortList = new SerialPortListClass();
var devices = [{}, {}];

async function main() {
  console.log(path);

  const serialPorts = await serialPortList.getList();
  console.log(JSON.stringify(serialPorts));

  SerialPort.Binding = BrightSignBinding;

  const options = {
    port: 2, // Port 0, 3.5mm Serial/RS232, Port 2, USB Serial
    baudRate: 115200, // Update to reflect the expected baud rate
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    autoOpen: false,
    module_root: '/storage/sd' // Source for where serialport will look for the underlying module
  }

  var port = new SerialPort(path, options);
  var parser = port.pipe(new ByteLength({ length: 1 }));

  port.open(function (err) {
    if (err) {
      return console.log('Error opening port: ', err.message)
    }
    console.log(`connected to serial ${path}, isOpen: ${port.isOpen}`);

    // Transmitter
    port.write('abc', function (err) {
      if (err) {
        console.log(err);
        return console.log('Error on write: ', err.message)
      }

      console.log('message written')
    })

  });

  // Receiver
  parser.on('data', function (data) {
    console.log("Parsed data: " + data);
  });

  // Open errors will be emitted as an error event
  port.on('error', function (err) {
    console.log(err);
    console.log('Error: ', err.message)
  })

  console.log(`After port creation`);

}

window.main = main;
