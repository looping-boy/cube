import asyncio
import random
import json
import websockets

import asyncio
import websockets
import json
import random

async def send_imu_data():
    i = 0
    async with websockets.connect("ws://cube-i7ov.onrender.com:5001") as websocket:
        current_rotation = {
            'gyro_x': 0.0,
            'gyro_y': 0.0,
            'gyro_z': 0.0
        }

        while True:
            target_rotation = {
                'gyro_x': random.uniform(-1.0, 1.0),
                'gyro_y': random.uniform(-1.0, 1.0),
                'gyro_z': random.uniform(-1.0, 1.0)
            }

            duration = 30  # Number of frames for the transition
            for frame in range(duration):
                # Calculate the intermediate rotation using the easing function
                t = frame / duration
                eased_rotation = {}
                for axis in ['gyro_x', 'gyro_y', 'gyro_z']:
                    eased_rotation[axis] = current_rotation[axis] + (target_rotation[axis] - current_rotation[axis]) * t

                # Convert to JSON and send to the server
                await websocket.send(json.dumps(eased_rotation))
                print("\rSending data", i, end="")
                i += 1

                # Wait for some time before sending the next frame
                await asyncio.sleep(0.02)

            # Update the current rotation to the target rotation after the transition
            current_rotation = target_rotation

asyncio.run(send_imu_data())
