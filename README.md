# Basic Reference Implementation - JavaScript Serial Application

This reference implementation is an example Node app built to demonstrate sending Serial Data over the BrightSign's 3.5mm Serial connector to be received on the BrightSign's USB-A port - a loopback test.

It introduces an approach to write HTML, Javascript, and Node.js for the BrightSign player. This is intended to be developed on your local machine, run and tested on a BrightSign unit. BrightAuthor:connected is not required for this application. 

## Getting Started

After cloning the repo and changing to its directory, do the following -

```bash
npm install
npm run build:dev
```

1. Connect the 3.5mm cable to the BrightSign's 3.5mm serial port, with the USB end connected to either USB-A or USB-C. 
2. From here the application can be ran on the player,

    **Deployment Method A:** Deploy the bundled application to the player through the DWS (Diagnostic Web Server) APIs. See [Enabling development tools on the Player](#enabling-development-tools-on-the-player) to enable the DWS, and [Deploying Code Remotely](#deploying-code-to-the-player) to deploy the code. 

    **Deployment Method B:** Alternatively, the bundled example, `dist/bundle`, `autorun.brs`, `index.html` can be copied to the root of the Micro SD card and insert into the player. Apply power to the player. 

3. To verify the test is working, either verify output by viewing logs in [DWS](#diagnostic-web-server-dws) or [SSH/Telnet](#verifying-tx-and-rx-functionality). 

## Preparing the Player for development

Your player needs to be setup with the console and have the BrightScript debugger enabled to be used with the 3.5mm Serial Port and DWS. It's also usually a good idea to start with a player that is factory reset.

### Enabling development tools on the Player

#### Diagnostic Web Server (DWS)

The Local Diagnostic Web Server (DWS) is available on all BrightSign players and can be accessed over a local network by browsing to the player's IP address in a browser window - `http://player-ip`. The DWS username is always `admin` and the default password is the serial number of the player.

**Note:** If you do not know the player's IP address, you can find it by connecting a monitor to the player and booting up the player without an SD card. The player will display a splash screen that includes its serial number, OS version, and IP address.

#### Registry keys

`registry write brightscript debug 1` will enable the BrightScript Debugger.

`registry write networking dwse on` will enable the DWS APIs to be accessible.

`registry write html enable_web_inspector 1` will enable the Chromium Web Inspector.

```
registry write brightscript debug 1
registry write networking dwse on
registry write html enable_web_inspector 1
reboot
```

#### Verifying TX and RX functionality

The BrightSign's log output when enabled, is sent over the 3.5mm Serial Port by default. 

This example application can receive the player console either outputted through the 3.5mm or via telnet / ssh (see [Telnet and SSH](https://docs.brightsign.biz/advanced/telnet-and-ssh) for info on enabling either). The USB Serial Port will also log a message when it receives serial data -  for this application it will come from the 3.5mm console output or the Serial Port write command sending serial data over the 3.5mm port. 

See [Deploying Code Remotely](#deploying-code-to-the-player) for info on how to deploy the code. 

### Enabling Console

This is not necessary, though receiving console output over a serial cable or Telnet / SSH connected to your PC gives insight into the application. Alternatively logs can be viewed in the DWS. You will need a serial cable and adapter for your computer, connected to the BrightSign's 3.5mm Serial Port. More info on this can be found on the [BrightSign Shell](https://docs.brightsign.biz/developers/brightsign-shell) page.

At the bash prompt on your computer, you can find the USB port by entering -
```bash
ls /dev/tty*
```

For example, the USB port might be /dev/tty.usbserial in which case you can execute a command like,
```
screen /dev/tty.usbserial 115200 
```

Once connected, use the serial software of your choice (on Linux and Mac, the "screen" command is quite popular and all you need). PuTTY could be leveraged for Windows users.

Power on the player with the SVC button pressed. Be near your keyboard because in a few seconds you will see:

```bash
Automatic startup in 3 seconds, press Ctrl-C to interrupt.
```

Press Ctrl-C and you will see a prompt that says SECURE or BOLT (depending on the player model). Type these commands:

```bash
console on
reboot
```

## Development lifecycle

### Deploying Code to the Player

The underlying shell scripts (used by `npm scripts`) require [jq](https://stedolan.github.io/jq/download/). 

Working at the command line is made much easier through using environment variables, and that is simplified using [direnv](https://direnv.net/docs/installation.html). Highly recommended.

If the following environment variables have not been set on your PC, go ahead and set them (`direnv` is your friend):

```
export PLAYER={your XC5 IP address or hostname}
export PLAYER_PW={the pw for that player, by default it's serial number}
```

The file `scripts/cp-to-player.sh` uses the DWS API to move files to the player. If your application builds additional files you will need to add them to that script in the line that lists the files to copy. For example:

```bash
for f in dist/*.html dist/*.js src/autorun.brs
```

To run the script you can either run it as a bash script from the command line, or from npm:

```
npm run cp
```

You should see the results of the webpack build, followed by a list of the files copied to the player.

### Starting the App on the Player

Just copying the files will not restart your application on the player. From a serial or Telnet / SSH session to the player:

Restarting the application can be done via, 
* rebooting the player (`npm run rp`), OR
* the [DWS -> Control Tab](https://docs.brightsign.biz/advanced/diagnostic-web-server-dws#L5wO3), OR
* BrightSign Shell commands below -
  ```
  ctrl-C
  BrightScript Debugger> exit
  BrightSign> script autorun.brs
  ```

Ctrl-C will break out of the autorun into the debugger, which you then `exit` and then run `script autorun.brs`  to start that autorun.

Alternatively, if DWS API or Serial / Telnet / SSH access is not configured, the player can be restarted by pressing the "Reset" button on the BrightSign, or re-applying power.

## How to define/find the correct path for BrightSign SerialPort:

The mapping from the physical port to the current path can be found using [serialportlist](https://docs.brightsign.biz/developers/serialportlist).
The "Friendly Identifiers" (fid) represent physical locations - including a hub port if relevant. The mapping to the device path is dynamic.
This example uses `@brightsign/serialportlist` on an XD1034 with a single USB serial port on the Type-A connector:

```
var SerialPortListClass = require("@brightsign/serialportlist");
var serialPortList = new SerialPortListClass();
serialPortList.getList().then( (l) => { console.log(JSON.stringify(l)) } )
```
  

The following result would be returned with the path:

```
[{"fid":"UART:0","path":"/dev/ttyS0"},{"fid":"UART:1","path":"/dev/ttyS1"},{"fid":"USB:B.0","path":"/dev/ttyUSB0","pid":9155,"vid":1659}]
```
