const video = document.getElementById('webcam');
const emotionDisplay = document.getElementById('emotion');
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBTPY_JX8FfHp5g0NVr8W5jVgZg0zpK-Js",
    authDomain: "chattica-ai-route.firebaseapp.com",
    projectId: "chattica-ai-route",
    storageBucket: "chattica-ai-route.firebasestorage.app",
    messagingSenderId: "388156484868",
    appId: "1:388156484868:web:6ff70b15735b09b648f451",
    measurementId: "G-10B5ZBXC49"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
// Start Webcam Stream
navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        emotionDisplay.innerText = "Error accessing webcam!";
        console.error("Webcam Error:", error);
    });


// Login Event
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Login Berhasil:", user);
            alert("Login Berhasil!");
            window.location.href = "/";  // Redirect ke halaman utama
        })
        .catch((error) => {
            console.error("Login Gagal:", error.message);
            document.getElementById('error-message').innerText = error.message;
        });
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    auth.signOut().then(() => {
        alert("Logout Berhasil!");
        window.location.href = "/login";  // Redirect ke halaman login
    }).catch((error) => {
        console.error("Logout Gagal:", error.message);
    });
});

// Pantau Status Login
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User Logged In:", user);
        document.getElementById('logout-btn').style.display = 'block';
    } else {
        console.log("User Logged Out");
        document.getElementById('logout-btn').style.display = 'none';
    }
});



// Capture and Send Image for Emotion Prediction
document.getElementById('capture-btn').addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Draw the current webcam frame onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Extract the face guide region only
    const faceX = canvas.width / 2 - 110;
    const faceY = canvas.height / 2 - 140;
    const faceWidth = 220;
    const faceHeight = 280;

    // Crop and create face region blob
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = faceWidth;
    faceCanvas.height = faceHeight;
    const faceCtx = faceCanvas.getContext('2d');
    faceCtx.drawImage(canvas, faceX, faceY, faceWidth, faceHeight, 0, 0, faceWidth, faceHeight);

    faceCanvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('image', blob, 'capture.jpg');

        fetch('/predict', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            emotionDisplay.innerText = `Detected Emotion: ${data.emotion}`;
        })
        .catch(error => {
            emotionDisplay.innerText = "Error in prediction!";
            console.error("Prediction Error:", error);
        });
    }, 'image/jpeg');
});
