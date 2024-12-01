# main.py
import json

from fastapi import FastAPI, WebSocket
from .websocket_server import WebSocketServer
from .Executor import Executor

def load_protocol():
    with open('messages.json', 'r') as f:
        protocol = json.load(f)
    return protocol

# 获取协议
protocol = load_protocol()

app = FastAPI()
  # Initialize WebSocketServer

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint that listens for incoming commands and interacts with the ScriptExecutor.
    """
    ws_server = WebSocketServer(websocket)
    await ws_server.run()
    print("WebSocket connection established.")
    print(protocol)
    try:
        while True:
            message = await ws_server.recv()
            print(f"Received from client: {message}")
            
            async def output_callback(output: str):
                await ws_server.send(output)

            if message == "start_timer":
                # Start the timer script
                command = ['python3', 'backend/timer.py']
                executor = Executor()
                await executor.execute(command, output_callback)


    except Exception as e:
        print(f"Error: {e}")
    finally:
        await websocket.close()
        print("WebSocket connection closed.")
