import asyncio
import random
import json
import websockets

async def send_imu_data():
    i = 0
    async with websockets.connect('wss://cube-app-ded2c0470b54.herokuapp.com/') as websocket:
        while True:
            imu_data = {
                'gyro_x': random.uniform(-1.0, 1.0),
                'gyro_y': random.uniform(-1.0, 1.0),
                'gyro_z': random.uniform(-1.0, 1.0)
            }

            # Convert to JSON and send to the server
            await websocket.send(json.dumps(imu_data))
            print("\rSending data", i, end="")
            i += 1

            # Wait for some time before sending the next data
            await asyncio.sleep(0.2)

asyncio.run(send_imu_data())