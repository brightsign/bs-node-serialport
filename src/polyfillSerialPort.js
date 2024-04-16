// ./polyfillSerialPort.js


// Function to create v8 bindings wrapper that forwards calls to v11 bindings
const createBindingsWrapper = () => {
    const v11Bindings = require('@serialport/bindings-interface');

    let BrightSignBinding;
    BrightSignBinding = require('@brightsign/serialport');
    console.log('BrightSignBinding', JSON.stringify(BrightSignBinding));

    if (!BrightSignBinding) return null;

    const v8Wrapper = {};

    if (typeof BrightSignBinding.SerialPort === 'function' && typeof BrightSignBinding.close === 'function') {
        return BrightSignBinding;
    }

    Object.keys(BrightSignBinding).forEach(key => {
        v8Wrapper[key] = function (...args) {
            return v11Bindings[key].apply(this, args);
        }
    });

    return v8Wrapper;
}

// Create v8 bindings wrapper
const compatibleBinding = createBindingsWrapper();

module.exports = {
    compatibleBinding
};
