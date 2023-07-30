const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 5001 });

wss.on('connection', (ws) => {
    console.log('Client connected.');

    ws.send('Hello from server!');

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




const server = http.createServer((req, res) => {
    // Check if the request is for the root URL
    if (req.url === '/') {
        // Read the HTML file from the file system
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        // For other URLs, respond with a 404 Not Found error
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the HTTP server to listen on port 5000
server.listen(5002, () => {
    console.log('HTTP server started and listening on http://localhost:5002');
});