# app/routes.py
from flask import Flask, request, jsonify, render_template
from model import predict_emotion
import cv2
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    np_image = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
    image = cv2.resize(image, (48, 48))  # Resize for model
    emotion = predict_emotion(image[np.newaxis, :, :, :])
    return jsonify({'emotion': emotion})

if __name__ == '__main__':
    app.run(debug=True)
