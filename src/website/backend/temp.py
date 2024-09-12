import io
import cv2
from fastapi import FastAPI
from fastapi.responses import Response


app = FastAPI()

@app.get("/image")
def get_image():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera.")
        return

    ret, frame = cap.read()
    cap.release()

    if not ret:
        print("Error: Can't receive frame. Exiting ...")
        return 

    _, buffer = cv2.imencode('.jpg', frame)
    data = io.BytesIO(buffer)

    return Response(content=data.getvalue(), media_type="image/")