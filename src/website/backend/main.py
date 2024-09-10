import io
import cv2
from fastapi import FastAPI
from starlette.background import BackgroundTask
from fastapi.responses import Response, StreamingResponse
from threading import Condition
import logging

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