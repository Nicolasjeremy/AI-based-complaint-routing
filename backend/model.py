from deepface import DeepFace

def predict_emotion(image_array):
    """
    Predict the dominant emotion from an image array.
    """
    try:
        # Use DeepFace for emotion detection
        analysis = DeepFace.analyze(image_array, actions=['emotion'], enforce_detection=False)

        # Extract the dominant emotion
        if isinstance(analysis, list) and len(analysis) > 0:
            dominant_emotion = analysis[0].get('dominant_emotion', "Unknown")
        else:
            dominant_emotion = analysis.get('dominant_emotion', "Unknown")

        return [dominant_emotion]
    except Exception as e:
        print(f"Error in DeepFace analysis: {e}")
        raise e
