const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();

app.use(express.static('public'));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected.');

  ws.send('Hello from server!');

  ws.on('message', (message) => {
    console.log(`Received message from client: ${message}`);
    wss.broadcast(`${message}`);
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started and listening on port ${PORT}`);
});
