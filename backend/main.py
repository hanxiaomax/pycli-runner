from fastapi import FastAPI, WebSocket
import subprocess
import asyncio

app = FastAPI()

# WebSocket endpoint: Execute different scripts based on data
@app.websocket("/ws")
async def websocket_script_executor(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection established.")  # Print when the connection is successful

    try:
        while True:
            # Receive message
            message = await websocket.receive_text()
            print(f"Received from client: {message}")

            if message == "start_timer":
                # Start a subprocess to execute timer.py or other shell commands
                process = subprocess.Popen(
                    ['python3', 'backend/timer.py'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
                )

                # Periodically get output and send it to the frontend
                async def send_timer_output():
                    while True:
                        # Read the subprocess output
                        line = process.stdout.readline()
                        if line:
                            print(f"Sending time: {line.strip()}")
                            await websocket.send_text(line.strip())  # Send the output to the frontend
                        # Check if the subprocess is still running
                        if process.poll() is not None and line == '':
                            break  # Exit the loop if the subprocess has finished and there's no new output
                        await asyncio.sleep(1)  # Check every second

                # Start the async task
                asyncio.create_task(send_timer_output())

            elif message == "start_calculator":
                # Execute cal.py for addition calculation
                process = subprocess.Popen(
                    ['python3', 'cal.py', '3', '5'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
                )

                # Get the calculation result
                result = process.stdout.read().strip()  # Use read() to get all output
                error = process.stderr.read().strip()  # Get error output

                if result:
                    print(f"Calculator result: {result}")
                    await websocket.send_text(result)  # Send the calculation result to the frontend
                elif error:
                    print(f"Error occurred: {error}")
                    await websocket.send_text(f"Error: {error}")  # If there's an error, send the error message
                else:
                    await websocket.send_text("No result produced.")  # If there's no result, send a message

            else:
                await websocket.send_text("Unknown command")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        await websocket.close()
        print("WebSocket connection closed.")
