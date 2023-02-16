# bs-node-serialport
A binding class to enable using https://www.npmjs.com/package/serialport on BrightSign players

Refer to the included example. 

In order to use the serialport library on a BrightSign player:

1. Create a SerialPort instance 
2. Create a BrightSign binding instance (see https://serialport.io/docs/api-bindings) 
3. Create a parser instance, (see https://serialport.io/docs/api-parsers-overview)
4. Assign the the BrightSign binding to the SerialPort
5. For reading, pipe the SerialPort to the parser
6. For writing, use the "write" method of the SerialPort. See the example in index.js, where the string "abc" is written

This example includes a custom BrightScript (autorun.brs) that creates the Node.js application, but you can also create an HTML 5 widget in BrightAuthor. Remember to check the box "Enable node.js".


#### How to define/find the correct path for BrightSign SerialPort:

The mapping from the physical port to the current path can be found using [serialportlist](https://brightsign.atlassian.net/wiki/spaces/DOC/pages/404623975/serialportlist).
The “Friendly Identifiers” (fid) represent physical locations - including a hub port if relevant. The mapping to the device path is dynamic.
This example uses @brightsign/serialportlist on an XD1034 with a single USB serial port on the Type-A connector:

```
var SerialPortListClass = require("@brightsign/serialportlist");
var serialPortList = new SerialPortListClass();
serialPortList.getList().then( (l) => { console.log(JSON.stringify(l)) } )
```
  

The following result would be returned with the path:

```
[{"fid":"UART:0","path":"/dev/ttyS0"},{"fid":"UART:1","path":"/dev/ttyS1"},{"fid":"USB:B.0","path":"/dev/ttyUSB0","pid":9155,"vid":1659}]
```
