const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket server event handling
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

// Send Message to every clients
wss.broadcast = function broadcast(msg) {
    console.log(msg);
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};

// // Serve the index.html file when the root URL is requested
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started and listening on port ${PORT}`);
});
