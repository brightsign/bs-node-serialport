// ./polyfillSerialPort.js
const fs = require('fs');

// Function to create v8 bindings wrapper that forwards calls to v11 bindings
const createBindingsWrapper = () => {
    const v11Bindings = require('@serialport/bindings-interface');

    let BrightSignBinding;
    BrightSignBinding = require('@brightsign/serialport');
    console.log('BrightSignBinding', JSON.stringify(BrightSignBinding));

    if (!BrightSignBinding) return null;

    const isFilePresent = fs.existsSync('/usr/lib/node_modules/@brightsign/serialport-nodejs/package.json');

    if (isFilePresent) {
      let spPackageVersion = require('/usr/lib/node_modules/@brightsign/serialport-nodejs/package.json').version;
      
      // v1.0.0 v8.x.x
      // v2.0.0 v11.x.x
      if (spPackageVersion.includes('2.0.0')) {
        return BrightSignBinding;
      }
    }

    // fs.readdir(`/usr/lib/node_modules/@brightsign/serialport-nodejs`, (err, files) => {
    //     files.forEach(file => {
    //         console.log(file);
    //     });
    // })

    const v8Wrapper = {};

    if (typeof BrightSignBinding.SerialPort === 'function' && typeof BrightSignBinding.close === 'function') {
        return BrightSignBinding;
    }

    Object.keys(BrightSignBinding).forEach(key => {
      v8Wrapper[key] = v11Bindings[key];
    });

    return v8Wrapper;
}

// Create v8 bindings wrapper
const compatibleBinding = createBindingsWrapper();

module.exports = {
    compatibleBinding
};
