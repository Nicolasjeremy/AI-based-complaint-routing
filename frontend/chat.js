document.addEventListener("DOMContentLoaded", () => {
    // Initialize Webcam
    const video = document.createElement("video");
    const camera = document.getElementById("camera");
    const emotionDisplay = document.getElementById("emotion");
    const chatInput = document.getElementById("chatInput");
    const chatWindow = document.getElementById("chatWindow");
    const sendButton = document.getElementById("btnpress"); // Fixed button reference

    // Start Webcam
    async function startCamera() {
        try {
            console.log("Starting webcam...");
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;

            video.addEventListener("loadedmetadata", () => {
                video.play();
                camera.appendChild(video);
                console.log("Webcam started successfully.");
            });
        } catch (err) {
            console.error("Webcam Error:", err);
            emotionDisplay.innerText = "Error accessing webcam!";
        }
    }

    startCamera();

    // Capture and Predict Emotion on Button Click
    sendButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent any default behavior, especially form submission
        console.log("Button clicked!");
    
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.error("Webcam not ready.");
            emotionDisplay.innerText = "Webcam not ready. Please try again.";
            return;
        }
    
        try {
            console.log("Capturing image from webcam...");
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
    
            // Capture the frame from the webcam
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
            // Extract face region
            const faceX = canvas.width / 2 - 110;
            const faceY = canvas.height / 2 - 140;
            const faceWidth = 220;
            const faceHeight = 280;
    
            const faceCanvas = document.createElement("canvas");
            faceCanvas.width = faceWidth;
            faceCanvas.height = faceHeight;
            const faceCtx = faceCanvas.getContext("2d");
            faceCtx.drawImage(
                canvas,
                faceX,
                faceY,
                faceWidth,
                faceHeight,
                0,
                0,
                faceWidth,
                faceHeight
            );
    
            console.log("Captured face region successfully.");
    
            // Convert canvas to Blob
            faceCanvas.toBlob(async (blob) => {
                if (!blob) {
                    console.error("Failed to create Blob from canvas.");
                    emotionDisplay.innerText = "Error capturing image!";
                    return;
                }
    
                const formData = new FormData();
                formData.append("image", blob, "capture.jpg");
    
                try {
                    console.log("Sending image to server...");
                    const response = await fetch("http://127.0.0.1:5000/predict", {
                        method: "POST",
                        body: formData,
                    });
                    if (!response.ok) {
                        throw new Error(`Server Error: ${response.status}`);
                    }
    
                    const data = await response.json();
                    console.log("Received response from server:", data);
                    
                    const emotion = data.emotion;
                    emotionDisplay.innerText = `Detected Emotion: ${emotion}`;
    
                    // Determine routing based on emotion
                    let routingMessage;
                    if (emotion === "neutral" || emotion === "happy") {
                        routingMessage = "You are feeling " + emotion + ". Your complaint will be handled by our AI assistant.";
                    } else {
                        routingMessage = `You are feeling ${emotion}. Your complaint will be routed to a human agent for further assistance.`;
                    }
    
                    // Append message to chat
                    const userMessage = chatInput.value.trim() || "You didn't type a message.";
                    const emotionMessage = routingMessage;
    
                    // User message bubble
                    const userBubble = document.createElement("div");
                    userBubble.textContent = userMessage;
                    userBubble.className = "chat-bubble self";
                    chatWindow.appendChild(userBubble);
    
                    // Emotion message bubble
                    const emotionBubble = document.createElement("div");
                    emotionBubble.textContent = emotionMessage;
                    emotionBubble.className = "chat-bubble bot";
                    chatWindow.appendChild(emotionBubble);
    
                    chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to bottom
                    chatInput.value = ""; // Clear input

                    
                } catch (error) {
                    console.error("Prediction Error:", error);
                    emotionDisplay.innerText = "Error in prediction!";
                }
            }, "image/jpeg");
        } catch (error) {
            console.error("Unexpected Error:", error);
            emotionDisplay.innerText = "Unexpected error occurred!";
        }
    });
});
