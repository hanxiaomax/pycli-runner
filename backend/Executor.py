# executor.py
import subprocess
import asyncio
from typing import Callable

class Executor:
    def __init__(self):
        pass

    async def execute(self, command: list, output_callback: Callable):
        """
        Execute a command asynchronously and stream the output to a callback function.
        :param command: The command to be executed as a list.
        :param output_callback: A callback function to send the output.
        """
        process = subprocess.Popen(
            command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )

        # Use asyncio.Queue to manage the output
        output_queue = asyncio.Queue()

        async def read_output():
            """
            Reads stdout and stderr of the process and puts the output in the queue.
            """
            while True:
                line = process.stdout.readline()
                if line:
                    await output_queue.put(line.strip())  # Put the line into the queue
                if process.poll() is not None and line == '':
                    break  # Exit if process has finished and no more output
                await asyncio.sleep(0.1)  # Wait before checking again

            # Check if there are any error messages
            error = process.stderr.read().strip()
            if error:
                await output_queue.put(f"Error: {error}")

        async def send_output():
            """
            Sends the output from the queue to the callback.
            """
            while True:
                output = await output_queue.get()  # Get the next output
                await output_callback(output)  # Send to callback
                if output == "EOF":  # Stop when end of file (EOF) is encountered
                    break

        # Start reading output and sending it
        asyncio.create_task(read_output())
        await send_output()  # Wait for the output to be sent

