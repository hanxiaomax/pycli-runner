// MainUI.tsx
import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import WebSocketClient from "./WebSocketClient"; // Import the WebSocketClient class

const MainUI: React.FC = () => {
  const [response, setResponse] = useState<string>("");

  // Instantiate the WebSocketClient
  const wsClient = new WebSocketClient();

  // Initialize WebSocket connection when the component mounts
  useEffect(() => {
    // Initialize WebSocket client with the server URL
    wsClient.init("ws://localhost:8000/ws");

    // Set up WebSocket client event handlers
    wsClient.onOpen(() => {
      console.log("WebSocket connected");
    });

    wsClient.onMessage((message: string) => {
      // Handle received messages
      setResponse(message);
    });

    wsClient.onError((error: string) => {
      console.error("WebSocket error:", error);
    });

    wsClient.onClose(() => {
      console.log("WebSocket closed");
    });

    // Cleanup WebSocket connection when component unmounts (only if needed)
    return () => {
      // You can optionally close the connection here if you want to close on component unmount
      // wsClient.close();
    };
  }, []);

  // Send a command to the WebSocket server
  const sendCommand = (command: string) => {
    wsClient.sendMessage(command);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          WebSocket Command Sender
        </Typography>

        {/* Main UI */}
        <Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => sendCommand("22")}
            sx={{ marginBottom: 2 }}
          >
            Start Timer
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => sendCommand("start_calculator")}
          >
            Start Calculator
          </Button>

          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6">Response:</Typography>
            <Typography variant="body1">{response}</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MainUI;
