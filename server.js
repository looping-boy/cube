const express = require('express');
const http = require('http');
const dgram = require('dgram');
const app = express();
const WebSocket = require('ws');

app.use(express.static('public'));

const server = http.createServer(app);

// Create a UDP server
const udpServer = dgram.createSocket('udp4');

udpServer.on('error', (err) => {
  console.log(`UDP server error:\n${err.stack}`);
  udpServer.close();
});

udpServer.on('message', (message, rinfo) => {
  console.log(`Received UDP message from client: ${message}`);
  // Broadcast the received message to all connected WebSocket clients
  wss.broadcast(`${message}`);
});

udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log(`UDP server listening on ${address.address}:${address.port}`);
});

udpServer.bind(5001); // UDP server listens on port 5001

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected.');

  ws.send('Hello from server!');

  ws.on('message', (message) => {
    console.log(`Received message from client: ${message}`);
    // If needed, you can handle WebSocket messages here
  });

  ws.on('close', () => {
    console.log('Client disconnected.');
  });
});

wss.broadcast = function broadcast(msg) {
    console.log(msg);
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Server started and listening on port ${PORT}`);
});