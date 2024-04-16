// Serialport's debug capabilities enable/disable
// process.env.DEBUG ="*"

const ReadlineParser = require('@serialport/parser-readline');
const SerialPortListClass = require("@brightsign/serialportlist");
const SerialPort = require('@serialport/stream');
const { compatibleBinding } = require('./polyfillSerialPort');

async function main() {
  // console.log(path);
  const serialPortList = new SerialPortListClass();
  let devices = [{}, {}];

  let serial35mmPath, serialUsbPath;

  const serialPorts = await serialPortList.getList();

  if (serialPorts.length !== 2) {
    console.error(`Found a total of ${serialPorts.length}. Expecting a total of 2 serial connections, 3.5mm serial cable sends to USB-A serial device.`);
    return;
  }

  for (let p = 0; p < serialPorts.length; p++) {
    if ("USB" == serialPorts[p]["fid"].substring(0, 3)) {
      serialUsbPath = serialPorts[p]["path"];
    }

    if ("UART" == serialPorts[p]["fid"].substring(0, 4)) {
      serial35mmPath = serialPorts[p]["path"];
    }
  }
  console.log(JSON.stringify(serialPorts));

  SerialPort.Binding = compatibleBinding;

  // Create serial ports using the selected binding
  let serialPort35mm = createSerialPort(serial35mmPath, "serialPort35mm");
  let countTx = 0;
  setTimeout(writeOut, 1000, serialPort35mm, countTx);

  let serialPortUSBA = createSerialPort(serialUsbPath, "serialPortUSBA");
}

function createSerialPort(path, name) {
  console.log(`Creating serial port ${name} at path: ${path}`);

  const options = {
    path,
    baudRate: 115200, // Update to reflect the expected baud rate
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    autoOpen: false,
  }

  const port = SerialPort(path, options);
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
