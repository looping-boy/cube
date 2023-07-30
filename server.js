const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 5001 });

wss.on('connection', (ws) => {
    console.log('Client connected.');

    // ws.send('Hello from server!');

    ws.on('message', (message) => {
        console.log(`Received IMU data: ${message}`);
        wss.broadcast(`${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected.');
    });


    // const sendDataInterval = setInterval(() => {
    //     ws.send(`${messaging}`);
    // }, 500);

    // // When the client disconnects, stop sending data
    // ws.on('close', () => {
    //     clearInterval(sendDataInterval);
    // });


});

wss.broadcast = function broadcast(msg) {
    console.log(msg);
    wss.clients.forEach(function each(client) {
        client.send(msg);
     });
 };

console.log("WebSocket server started and listening on ws://localhost:5001");
