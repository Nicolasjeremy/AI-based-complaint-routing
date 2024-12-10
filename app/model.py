# app/model.py
import cv2
import numpy as np
from deepface import DeepFace

# Emotion Detection Function
# Corrected Emotion Detection Function
def predict_emotion(image_array):
    try:
        # Use DeepFace for emotion detection
        analysis = DeepFace.analyze(image_array, actions=['emotion'], enforce_detection=False)

        # Check for list format
        if isinstance(analysis, list) and len(analysis) > 0:
            dominant_emotion = analysis[0].get('dominant_emotion', "Unknown")
        else:
            dominant_emotion = analysis.get('dominant_emotion', "Unknown")

        print(f"Detected Emotion: {dominant_emotion}")
        return [dominant_emotion]

    except Exception as e:
        print(f"Error in DeepFace analysis: {e}")
        return ["Emotion Detection Failed"]

