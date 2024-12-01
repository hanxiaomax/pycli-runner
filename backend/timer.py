import asyncio
from datetime import datetime
import sys

async def print_time():
    while True:
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(current_time)  
        sys.stdout.flush()  
        await asyncio.sleep(1) 

async def main():
    await print_time() 

if __name__ == "__main__":
    asyncio.run(main())  
