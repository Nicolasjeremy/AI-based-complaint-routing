# app/model.py
import tensorflow as tf

def load_model():
    return tf.keras.models.load_model('models/emotion_model.h5')

def predict_emotion(image_array):
    model = load_model()
    predictions = model.predict(image_array)
    emotion = ['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral', 'Fear'][predictions.argmax()]
    return emotion
