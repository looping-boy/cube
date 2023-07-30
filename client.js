const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5001');

ws.on('open', () => {
  console.log('Connected to server.');

  // Send messages to the server at regular intervals
  setInterval(() => {
    const message = 'Some IMU data';
    ws.send(message);
    console.log(`Sent IMU data: ${message}`);
  }, 2000);
});

ws.on('message', (message) => {
  console.log(`Received from server: ${message}`);
});

ws.on('close', () => {
  console.log('Connection closed.');
});
