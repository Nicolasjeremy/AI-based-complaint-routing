from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
from app.model import predict_emotion
import os
import cv2
import numpy as np

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    # Render the HTML form for uploading an image
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    # Save the uploaded file
    file = request.files['image']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Read and preprocess the image
    image = cv2.imread(filepath)
    image = cv2.resize(image, (48, 48))  # Resize for the model
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
    image = image[np.newaxis, :, :, np.newaxis] / 255.0  # Normalize

    # Predict emotion
    emotion = predict_emotion(image)

    # Remove the uploaded file to clean up
    os.remove(filepath)

    return jsonify({'emotion': emotion})

if __name__ == '__main__':
    app.run(debug=True)
