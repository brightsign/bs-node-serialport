# bs-node-serialport
A binding class to enable using https://www.npmjs.com/package/serialport on BrightSign players

Refer to the included example. 

In order to use the serialport library on a BrightSign player:

1. Create a SerialPort instance Create a BrightSign binding instance (see https://serialport.io/docs/api-bindings)
2. Create a parser instance, (see https://serialport.io/docs/api-parsers-overview)
3. Assign the the BrightSign binding to the SerialPort
4. For reading, pipe the SerialPort to the parser
5. For writing, use the "write" method of the SerialPort. See the example in index.js, where the string "abc" is written

This example includes a custom BrightScript (autorun.brs) that creates the Node.js application, but you can also create an HTML 5 widget in BrightAuthor. Remember to check the box "Enable node.js".
