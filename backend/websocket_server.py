# websocket_server.py
from fastapi import WebSocket


class WebSocketServer:
    def __init__(self,websocket):
        self.websocket = websocket

    async def run(self):
      await self.websocket.accept()

    async def send(self,msg):
      await self.websocket.send_text(msg)

    async def recv(self):
      return await self.websocket.receive_text()