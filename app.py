import sys
print(sys.path)

from flask import Flask, request, jsonify, render_template
from app.model import predict_emotion
import os
from werkzeug.utils import secure_filename
import cv2
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Set the upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Define routes
@app.route('/')
def index():
    """
    Render the main webpage
    """
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    # Save uploaded file
    file = request.files['image']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Load and process the image
    image = cv2.imread(filepath)
    if image is None:
        return jsonify({'error': 'Invalid image format'}), 400

    # Predict Emotion
    emotion = predict_emotion(image)

    # Clean up the uploaded file
    os.remove(filepath)

    return jsonify({'emotion': emotion})





if __name__ == '__main__':
    app.run(debug=True)
