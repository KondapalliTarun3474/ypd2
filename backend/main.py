import asyncio
import websockets
import cv2 as cv
import PoseModule as pm
import pose_equal_check as pec
import json
import base64
import numpy as np
import pygame
import gtts as gTTS
import io
import threading
import time

# Initialize pose detection modules
detector = pm.PoseDetector()
pose_similarity = pec.PoseSimilarity()
pygame.mixer.init()

# Define asana names mapping to IDs
asana_names = {
    1: "pranamasana",
    2: "hastauttanasana",
    3: "hastapadasana",
    4: "right_ashwa_sanchalanasana",
    5: "left_ashwa_sanchalanasana",
    6: "dandasana",
    7: "ashtanga_namaskara",
    8: "bhujangasana",
    9: "adho_mukha_svanasana"
}

def text_to_speech(text):
    """Plays TTS audio without reinitializing pygame mixer."""
    try:
        # Convert the text to speech using gTTS (Google TTS)
        tts = gTTS.gTTS(text=text, lang='en-in')

        # Create an in-memory file for the speech
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)

        # Play the speech using pygame
        pygame.mixer.music.load(mp3_fp, 'mp3')
        pygame.mixer.music.play()

        # Do not block the thread, check periodically
        while pygame.mixer.music.get_busy():
            time.sleep(0.1)

    except Exception as e:
        print(f"Error in text_to_speech: {e}")

async def handler(websocket):
    """
    Handles WebSocket connections and processes incoming frames for pose analysis.
    """
    print("Client connected.")
    try:
        async for message in websocket:
            data = json.loads(message)
            asana_id = data.get("asanaNumber")
            image_data = data.get("imageData")

            if not asana_id or not image_data:
                await websocket.send(json.dumps({"error": "Invalid data"}))
                continue

            # Decode the base64 image
            try:
                if ',' in image_data:
                    image_bytes = base64.b64decode(image_data.split(',')[1])
                else:
                    image_bytes = base64.b64decode(image_data)
                np_arr = np.frombuffer(image_bytes, np.uint8)
                frame = cv.imdecode(np_arr, cv.IMREAD_COLOR)
            except (base64.binascii.Error, IndexError) as e:
                await websocket.send(json.dumps({"error": f"Image decode error: {e}"}))
                continue

            # Find pose landmarks
            frame_with_pose = detector.findPose(frame)
            landmarks = detector.findPosition(frame_with_pose)

            if not landmarks:
                await websocket.send(json.dumps({"data": 0, "confidence": 0}))
                continue

            # Normalize landmarks
            normalized_landmarks = pose_similarity.normalize_landmarks(landmarks, reference_idx=0)
            pose_name = asana_names.get(asana_id)

            if not pose_name:
                await websocket.send(json.dumps({"error": "Invalid asana ID"}))
                continue

            # Check for similarity and accuracy
            is_similar, correct_landmarks = pose_similarity.isSimilar(pose_name, normalized_landmarks, 0.3)

            if is_similar:
                accuracy = pose_similarity.accuracy(pose_name, normalized_landmarks, 30)
                wrong_joints = pose_similarity.get_wrong_joints(pose_name, correct_landmarks, normalized_landmarks, 45)

                if not wrong_joints:
                    text = "Perfect pose!"
                    threading.Thread(target=text_to_speech, args=(text,)).start()
                    await websocket.send(json.dumps({"data": 2, "confidence": accuracy / 100}))
                else:
                    feedback_parts = []
                    for joint_key in wrong_joints:
                        joint_name = wrong_joints[joint_key][0]
                        change = wrong_joints[joint_key][1]
                        feedback_parts.append(f"{change} angle at {joint_name.replace('_', ' ')}")

                    feedback_text = ". ".join(feedback_parts[:2])
                    threading.Thread(target=text_to_speech, args=(feedback_text,)).start()
                    await websocket.send(json.dumps({"data": 3, "confidence": accuracy / 100}))
            else:
                text = "Adjust your position."
                threading.Thread(target=text_to_speech, args=(text,)).start()
                await websocket.send(json.dumps({"data": 1, "confidence": 0}))

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected.")
    except Exception as e:
        print(f"An error occurred: {e}")
        await websocket.send(json.dumps({"error": str(e)}))

async def main():
    """
    Starts the WebSocket server.
    """
    async with websockets.serve(handler, "localhost", 8765):
        print("WebSocket server started at ws://localhost:8765")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Server stopped by KeyboardInterrupt.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")