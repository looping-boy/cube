const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const express = require("express");
const app = express();

const wss = new WebSocket.Server({ noServer: true });

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
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`HTTP server started and listening on ${PORT}`);
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});





// Create a WebSocket instance
const socket = new WebSocket('ws://cube-app-ded2c0470b54.herokuapp.com:5001');

// Event listener for when the connection is established
socket.onopen = () => {
    console.log('Connected to WebSocket server.');
    sendMessage('Hello server, this is the client!');
};

// Event listener for receiving messages from the server
socket.onmessage = (event) => {
    const message = event.data;
    console.log(`Received message from server: ${message}`);
    // Process the received message as needed
    // For example, update the UI with the received message
};

// Event listener for connection closure
socket.onclose = () => {
    console.log('Connection to WebSocket server closed.');
};

// Function to send a message to the server
function sendMessage(message) {
    socket.send(message);
}

sendMessage('Hello server, this is the client!');