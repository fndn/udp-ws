# udp-ws

simple bridge that relays any message received on UDP to all clients connected with WS

## Simple test

Start the bridge: `npm start`  
Send a UDP package: `echo -n "hello" | nc -4u localhost 8100`


