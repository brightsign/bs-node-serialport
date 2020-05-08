const { promisify } = require('util')
const AbstractBinding = require('@serialport/binding-abstract')

const defaultBindingOptions = Object.freeze({
  vmin: 1,
  vtime: 0,
})

let bsSerialPort = null;
let serialBuffer = Buffer.alloc(65535);
let bufferCounter = 0;
let isPortOpen = false;

/**
 * The brightsign binding layer
 */
class BrightSignBinding extends AbstractBinding {
  static list() {
    return { manufacturer: 'BrightSign'}
  }

  constructor(opt = {}) {
    super(opt)
    this.bindingOptions = { ...defaultBindingOptions, ...opt.bindingOptions }
    this.writeOperation = null
  }

  get isOpen() {
    return isPortOpen
  }

  async open(path, options) {
    await super.open(path, options)
    
    // '/dev/ttyS0' maps to BrightSign's Port 0, 3.5mm Serial/RS232
    // BrightSign's Port 2, USB Serial
    let serial = new BSSerialPort(options.port);

    serial.SetBaudRate(options.baudRate);
    serial.SetDataBits(options.dataBits);
    serial.SetStopBits(options.stopBits);
    serial.SetParity(options.parity);

    serial.SetGenerateByteEvent(true);
    
    serial.onserialbyte = function(e){
      var sbyte = e.sbyte;
      console.log('### onserialbyte: ' + sbyte);
      serialBuffer[bufferCounter] = sbyte;
      bufferCounter++;
    }

    isPortOpen = true;
    bsSerialPort = serial;
  }

  async close() {
    await super.close()
    this.openOptions = null
    
    // Todo Bug: close() is called immediately after open
    console.log('port was closed...');
    bsSerialPort = null
    isPortOpen = false
    return 
  }

  async read(buffer, offset, length) {
    await super.read(buffer, offset, length)
    await this.waitForData(100);
    const minBytes = Math.min(bufferCounter, length);
    const bytesRead = serialBuffer.copy(buffer, offset, 0, minBytes);
    
    // Return this.read() to maintain a read loop
    if (bytesRead === 0) {
      return this.read(buffer, offset, length);
    }

    // If length < this.bufferCounter, make a new this.serialBuffer, and copy the remaining bytes from the old one to the beginning of the new one
    // There is a small chance some incoming data could be lost during this copy; we should discuss
    if (length < bufferCounter) {
      let newBuffer = Buffer.alloc(65535);
      serialBuffer.copy(newBuffer, 0, bytesRead, bufferCounter)
      Object.assign(newBuffer, serialBuffer);
      bufferCounter = bufferCounter - bytesRead;
    } else {
      // Buffer is overwritten when received bytes insert starting at 0
      bufferCounter = 0;
    }

    return { bytesRead };
  }

  // Return promptly to allow other processes to continue running
  async waitForData(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  async write(buffer) {
    this.writeOperation = super.write(buffer).then(async () => {
      if (buffer.length === 0) {
        return
      }

      var arrayBuffer = new Uint8Array(buffer).buffer;

      bsSerialPort.SendBytes(arrayBuffer);
      this.writeOperation = null
    })
    return this.writeOperation
  }

  async update(options) {
    throw new Error("getBaudRate() is currently not supported.")
  }

  async set(options) {
    throw new Error("set() is currently not supported.")
  }

  async get() {
    throw new Error("get() is currently not supported.")
  }

  async getBaudRate() {
    throw new Error("getBaudRate() is currently not supported.")
  }

  async drain() {
    throw new Error("drain() is currently not supported.")
  }

  async flush() {
    throw new Error("flush() is currently not supported.")
  }
}

module.exports = BrightSignBinding
