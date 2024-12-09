const video = document.getElementById('webcam');
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream });

function capture() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('image', blob, 'capture.jpg');
        fetch('/predict', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => { document.getElementById('emotion').innerText = data.emotion });
    });
}
