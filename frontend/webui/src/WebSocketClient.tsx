import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Paper,
} from "@mui/material";

// Define the WebSocketClient component
const WebSocketClient: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Establish WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    setSocket(ws);

    ws.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event: MessageEvent) => {
      setResponse(event.data); // Update response state with received message
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup WebSocket connection
    return () => {
      ws.close();
    };
  }, []);

  // Send command to WebSocket server
  const sendCommand = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
      console.log("Message sent:", message);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          WebSocket Command Sender
        </Typography>
        {isConnected ? (
          <Box>
            <TextField
              fullWidth
              label="Enter Command"
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={sendCommand}
              sx={{ marginTop: 2 }}
            >
              Send Command
            </Button>
            <Box sx={{ marginTop: 3 }}>
              <Typography variant="h6">Response:</Typography>
              <Typography variant="body1">{response}</Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" align="center">
            WebSocket connection is being established...
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default WebSocketClient;
