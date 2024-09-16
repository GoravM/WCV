import io
import cv2
from fastapi import FastAPI
from starlette.background import BackgroundTask
from fastapi.responses import Response, StreamingResponse
from threading import Condition
import logging
import socket

app = FastAPI()

# Initialize the camera (you may need to adjust the camera index if it's not the default)
camera = cv2.VideoCapture(0)


@app.get("/image")
def get_image():
    ret, frame = camera.read()  # Capture frame-by-frame
    if not ret:
        return Response(status_code=500, content="Could not capture image")
    
    # Convert the frame to JPEG
    _, jpeg = cv2.imencode('.jpg', frame)
    return Response(content=jpeg.tobytes(), media_type="image/jpeg")


class StreamingOutput(io.BufferedIOBase):
    def __init__(self):
        self.frame = None
        self.condition = Condition()

    def write(self, buf):
        with self.condition:
            self.frame = buf
            self.condition.notify_all()

    def read(self):
        with self.condition:
            self.condition.wait()
            return self.frame


def generate_frames():
    while True:
        ret, frame = camera.read()  # Read from camera
        if not ret:
            logging.error("Failed to capture frame")
            break
        
        # Encode frame to JPEG format
        _, jpeg = cv2.imencode('.jpg', frame)
        yield (b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + jpeg.tobytes() + b"\r\n")


@app.get("/mjpeg")
async def mjpeg():
    def stop():
        print("Stopping stream")

    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame",
        background=BackgroundTask(stop),
    )


# @app.post("/{direction}")
# async def control_movement(direction: str):

#     print("CALLED")
#     print(direction)
#     if direction == "forward":
#         # Logic for moving forward
#         return {"message": "Moving forward"}
#     elif direction == "left":
#         # Logic for turning left
#         return {"message": "Turning left"}
#     elif direction == "stop":
#         # Logic for stopping
#         return {"message": "Stopped"}
#     elif direction == "right":
#         # Logic for turning right
#         return {"message": "Turning right"}
#     elif direction == "reverse":
#         # Logic for moving in reverse
#         return {"message": "Moving in reverse"}
#     else:
#         return {"message": "Unknown command"}

@app.post("/motor_control/{direction}")
async def control_movement(direction: str):

    print("CALLED")
    print(direction)

    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect(('127.0.0.1', 65432))  # Connect to C++ server

    if direction == "forward":
        # Logic for moving forward
        client_socket.sendall(b'forward')
        data = client_socket.recv(1024)
        client_socket.close()
        return {"message": "Moving forward " + data.decode('utf-8')}

    elif direction == "left":
        # Logic for turning left
        client_socket.sendall(b'left')
        data = client_socket.recv(1024)
        client_socket.close()
        return {"message": "Turning left " + data.decode('utf-8')}

    elif direction == "stop":
        # Logic for stopping
        client_socket.sendall(b'stop')
        data = client_socket.recv(1024)
        client_socket.close()
        return {"message": "Stopped " + data.decode('utf-8')}

    elif direction == "right":
        # Logic for turning right
        client_socket.sendall(b'right')
        data = client_socket.recv(1024)
        client_socket.close()
        return {"message": "Turning right " + data.decode('utf-8')}

    elif direction == "reverse":
        # Logic for moving in reverse
        client_socket.sendall(b'reverse')
        data = client_socket.recv(1024)
        client_socket.close()
        return {"message": "Moving in reverse: " + data.decode('utf-8')}

    else:
        return {"message": "Unknown command"}
