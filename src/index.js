// Serialport's debug capabilities enable/disable
// process.env.DEBUG ="*"

const SerialPort = require('@serialport/stream');
// @brightsign/serialport is supported in OS 8.2.26+, this is replacing the /src/bs-binding.js
const BrightSignBinding = require('@brightsign/serialport');
const ReadlineParser = require('@serialport/parser-readline');

const path = '/dev/ttyS0';
// var path = '/dev/ttyUSB0';

const SerialPortListClass = require("@brightsign/serialportlist");
const serialPortList = new SerialPortListClass();
let devices = [{}, {}];

let port;

let count = 0;

async function main() {
  console.log(path);

  const serialPorts = await serialPortList.getList();
  console.log(JSON.stringify(serialPorts));

  SerialPort.Binding = BrightSignBinding;

  
  let portSerial35mm = createSerialPort(0, "/dev/ttyS0", "portSerial35mm");
  let countTx = 0;
  setTimeout(writeOut, 1000, portSerial35mm, countTx);
  
  let portSerialUSBA = createSerialPort(2, "/dev/ttyUSB0", "portSerialUSBA");
}

function createSerialPort(portNumber, path, name) {

  const options = {
    port: portNumber, // Port 0, 3.5mm Serial/RS232, Port 2, USB Serial
    baudRate: 115200, // Update to reflect the expected baud rate
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    autoOpen: false,
    module_root: '/storage/sd' // Source for where serialport will look for the underlying module
  }
   
  port = new SerialPort(path, options);
  let parser = port.pipe(new ReadlineParser());

  port.open(function (err) {
    if (err) {
      return console.log(`Error opening port: ${err.message}`);
    }
    console.log(`connected to serial ${path}, isOpen: ${port.isOpen}`);
  });

  // Receiver
  parser.on('data', function (data) {
    console.log(`Received on ${path} parsed data: ${data}`);
  });

  // Open errors will be emitted as an error event
  port.on('error', function (err) {
    console.log(err);
    console.log(`Error: ${err.message}`);
  })

  return port;
}

// Transmitter
function writeOut(serialPort, count) {
  let msg = `sent from ${serialPort.path} count: ${count}\n`;
  serialPort.write((msg), function (err) {
    if (err) {
      console.log(err);
      return console.log(`Error on write: ${err.message}`);
    }

    console.log(`${serialPort.path} message written`);

    count += 1;
    setTimeout(writeOut, 1000, serialPort, count);
  });
}

window.main = main;
