from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from werkzeug.utils import secure_filename
import os
from deepface import DeepFace
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
import cv2

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["https://nicolasjeremy.github.io"])  # Allow specific frontend origin

# Set the upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return "Emotion Detection API is running"

# Define routes
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['image']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    try:
        image = cv2.imread(filepath)
        if image is None:
            os.remove(filepath)
            return jsonify({'error': 'Invalid image format'}), 400

        # Use DeepFace for face detection and emotion recognition
        analysis = DeepFace.analyze(image, actions=['emotion'], enforce_detection=False)
        
        # Extract the dominant emotion
        if isinstance(analysis, list) and len(analysis) > 0:
            detected_emotion = analysis[0].get('dominant_emotion', 'No face detected')
        else:
            detected_emotion = analysis.get('dominant_emotion', 'No face detected')

        print(f"Detected Emotion: {detected_emotion}")  # Log detected emotion

        os.remove(filepath)
        return jsonify({'emotion': detected_emotion})

    except Exception as e:
        print(f"Error during prediction: {str(e)}")  # Log error
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({'error': f"Face detection failed: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
