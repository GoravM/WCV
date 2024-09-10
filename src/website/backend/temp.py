import cv2
import time

def captureoneframe():
    # Initialize the camera
    cap = cv2.VideoCapture(0)  # Change the index if needed

    if not cap.isOpened():
        print("Error: Could not open camera.")
        return

    # Wait for a short period to let the camera warm up
    time.sleep(2)  # Wait for 2 seconds

    # Attempt to capture a frame
    ret, frame = cap.read()

    if not ret:
        print("Error: Can't receive frame. Exiting ...")
    else:
        # Save the captured frame
        cv2.imwrite('capturedimage.jpg', frame)
        print("Image captured and saved as 'capturedimage.jpg'.")

    # Release the capture
    cap.release()

if __name__ == '__main__':
    captureoneframe()