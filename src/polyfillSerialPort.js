// ./polyfillSerialPort.js

const bindings = require('bindings');
const v11Bindings = bindings('serialport-v11');

// Check if BrightSignBinding is available and determine its type
let BrightSignBinding;
try {
  BrightSignBinding = require('@brightsign/serialport');
} catch (error) {
  BrightSignBinding = null;
}

// Function to create v8 bindings wrapper that forwards calls to v11 bindings
const createV8BindingsWrapper = () => {
  if (!BrightSignBinding) return null;

  const v8Wrapper = {};

  // Check if the binding has 'SerialPort' and 'close' methods
  if (typeof BrightSignBinding.SerialPort === 'function' && typeof BrightSignBinding.close === 'function') {
    return BrightSignBinding;
  }

  // Otherwise, assume v8 binding and create wrapper
  Object.keys(BrightSignBinding).forEach(key => {
    v8Wrapper[key] = function() {
      return v11Bindings[key].apply(v11Bindings, arguments);
    }
  });

  return v8Wrapper;
};

// Create v8 bindings wrapper
const v8Bindings = createV8BindingsWrapper();

module.exports = {
  SerialPort: v11Bindings.SerialPort, // Use v11 bindings for SerialPort
  BrightSignBinding: BrightSignBinding ? v8Bindings || null : null, // Use v8 bindings if available, otherwise null
  v8Bindings // Export v8 bindings
};
