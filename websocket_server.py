import asyncio
import websockets

async def receive_imu_data(websocket, path):
    async for message in websocket:
        print(f"Received IMU data: {message}")

async def main():
    server = await websockets.serve(receive_imu_data, "localhost", 5000)
    print("WebSocket server started and listening on ws://localhost:5000")

    # Keep the server running indefinitely
    await server.wait_closed()

asyncio.run(main())