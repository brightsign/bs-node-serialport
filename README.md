# Basic Reference Implementation - JavaScript Serial Application

This reference implementation is a Node app example which sends and receives serial data over the defined Serial Port. It introduces an approach to write HTML, Javascript, and Node.js for the BrightSign player. This is intended to be developed on your local machine, run and tested on a BrightSign unit. BrightAuthor:connected is not required for this application. 

This reference currently assumes USB-A is sending to USB-C serial protocol. It may be the case the Player's log output is over the 3.5mm Serial Port or SSH/Telnet. 

## Getting Started
---
After cloning the repo and changing to it's directory, do the following. 

```bash
npm i
npm run build
npm run cp 
```

Deploy the bundled application to the player through the DWS APIs. See 
[Enabling development tools on the Player ](#enable-player-development-tools) for more info.

## Preparing the Player for development
---
Your player needs to be setup with the console and the BrightScript debugger enabled to be used with the 3.5mm Serial Port and DWS. It's also usually a good idea to start with a player that is freshly factory reset.

### Enabling development tools on the Player 
### <a id="enable-player-development-tools"></a>

`script debug on` will enable the BrightScript Debugger. Reboot the player and you will see logs on serial session. Press the SVC button and it will drop you to a BrightSign prompt.

`registry write networking dwse on` will enable the DWS APIs to be accessible. Default password is the serial number of the player.

`registry write html enable_web_inspector 1` will enable the Chromium Web Inspector.

```
script debug on
registry write networking dwse on
registry write html enable_web_inspector 1
reboot
```

See [Deploying Code Remotely](#deploy-code) for info on how to deploy the code. 

### Enabling Console

This is not necessary, though receiving console output over a serial cable or SSH connected to your PC gives insight into the application. Alternatively logs can be viewed in the DWS. You will need a serial cable and adapter for your computer, connected to the BrightSign's 3.5mm Serial Port.

At the prompt, you can find the USB port by entering
```bash
ls /dev/tty*
```

For example, the USB port might be /dev/tty.usbserial in which case you can execute a command like,
```
screen /dev/tty.usbserial 115200 
```

Once connected, use the serial software of your choice (on linux and Mac, the "screen" command is quite popular and all you need).

Power on the player with the SVC button pressed.  Be near your keyboard because in a few seconds you will see:

```bash
Automatic startup in 3 seconds, press Ctrl-C to interrupt.
```

Press Ctrl-C and you will see a prompt that says SECURE or BOLT (depending on the player model).  Type these commands:

```bash
console on
reboot
```

## Development lifecycle
---
### Deploying Code to the Player

### <a id="deploy-code"></a>

On your PC, set the following environment variables (direnv is your friend):

```
export PLAYER={your XC5 IP address or hostname}
export PLAYER_PW={the pw for that player, by default it's serial number}
export PLAYER_STORAGE="<sd | ssd">
```

The file scripts/put uses the DWS API to move files to the player.  If your application builds additional files you will need to add them to that script in the line that lists the files to copy.  For example:

```bash
for f in dist/*.html dist/*.js src/autorun.brs
```

The current script copies all the html and js files in the dist folder, and the autorun from the source file.  If your app needs more files, add them to that line.

To run the script you can either run it as a bash script from the command line, or from npm:

```
npm run cp
```

You should see the results of the webpack build, followed by a list of the files copied to the player.

### Starting the App on the Player

Just copying the files will not restart your application on the player.  From a serial or SSH session to the player:

```
ctrl-C
BrightScript Debugger> exit
BrightSign> script autorun.brs
```
Ctrl-C will break out of the autorun into the debugger, which you then `exit` and then run `script autorun.brs`  to start that autorun.

Alternatively, if Serial or SSH access is not configured, the player can be restarted by pressing the "Reset" button on the BrightSign, or re-applying power.

## How to define/find the correct path for BrightSign SerialPort:

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
