// This JavaScript code is a comprehensive application that incorporates various features such as:
// Webcam and Canvas: It accesses the user's webcam and displays the video stream on a canvas element. It also allows for taking snapshots from the video stream.
// Speech Recognition: It uses the Web Speech API to recognize spoken words and transcribe them into text. The recognized text is displayed on the page.
// Text-to-Speech: It synthesizes text into speech using the Web Speech API.
// Audio Recording: It records audio from the user's microphone and allows for saving the recording as a WAV file.
// Image and Audio Upload: It uploads images and audio files to a server.
// Auto-Capture: It automatically captures and uploads images at regular intervals.
// Here's a breakdown of each part of the code:
// Variables and Initialization
// videoStream: Stores the video stream from the webcam.
// audioChunks: Stores audio data chunks for media recording.
// mediaRecorder: The MediaRecorder object for audio recording.
// imageBlob: Stores the image blob for uploading.
// autoCaptureIntervalId: Stores the interval ID for auto-capture.
// Webcam and Canvas
// takeSnapshot(): Takes a snapshot from the video stream and gets the image data as a URL or Blob.
// processCapturedImageBlob(blob): Processes the captured image blob.
// Speech Recognition
// startSpeechRecognition(): Starts speech recognition.
// stopSpeechRecognition(): Stops speech recognition.
// recognition.onresult: Handles speech recognition results and updates the text element with the recognized text.
// Text-to-Speech
// speakText(): Synthesizes text into speech.
// speakTextByInput(text): Synthesizes input text into speech.
// Audio Recording
// startAudioRecording(): Starts audio recording and sets up event handlers for data availability and stop.
// stopAudioRecording(): Stops audio recording.
// Image and Audio Upload
// uploadImage(): Uploads the captured image to the server.
// uploadAudio(): Uploads the recorded audio to the server.
// uploadImageWithDescription(inputString): Uploads the image with a description to the server.
// Auto-Capture
// startAutoCapture(): Starts auto-capture at regular intervals.
// stopAutoCapture(): Stops auto-capture.
// Miscellaneous
// window.onbeforeunload: Stops video and audio streams when navigating away from the page.
// This code combines various features to create a comprehensive application that interacts with the user through speech, text, and images.

// Declare a variable to store the video stream from the webcam
let videoStream;

// Get the video and canvas elements from the HTML document
const video = document.getElementById("video"); // Get the video element
const canvas = document.getElementById("canvas"); // Get the canvas element
const context = canvas.getContext("2d"); // Get the 2D drawing context for the canvas

// Declare variables to store audio data chunks for MediaRecorder
let audioChunks = []; // Store audio data chunks
let mediaRecorder; // MediaRecorder object

// Declare a variable to store the image blob
let imageBlob;

// Declare a variable to store the auto-capture interval ID
let autoCaptureIntervalId = null; // Initialize to null

// Initialize the SpeechRecognition object
let recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition)();

// Set the continuous property to true to allow continuous recognition
recognition.continuous = true;

// Set the interimResults property to true to get interim results
recognition.interimResults = true;

// Set the language property to 'en-US' for US English
recognition.lang = "en-US";

// Define the onresult event handler function
recognition.onresult = function (event) {
  // Initialize an empty string to store the speech result
  let speechResult = "";

  // Loop through the results from the current index to the end
  for (let i = event.resultIndex; i < event.results.length; i++) {
    // Check if the result is final
    if (event.results[i].isFinal) {
      // Add the transcript to the speech result
      speechResult += event.results[i][0].transcript;
    }
  }

  // Update the inner text of the 'speech-to-text' element with the speech result
  document.getElementById("speech-to-text").innerText = speechResult;
};

// Check if the browser supports the MediaDevices API and getUserMedia method
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Call the getUserMedia method to request access to the camera
  navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
    // Store the camera stream in the videoStream variable
    videoStream = stream;

    // Set the source of the video element to the camera stream
    video.srcObject = stream;

    // Play the video element to display the camera stream
    video.play();
  });
}

// Function to take a snapshot from the video stream
function takeSnapshot() {
  // Draw the video frame on the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the image data as a URL
  const imageDataUrl = canvas.toDataURL("image/png");

  // Alternatively, get the image data as a Blob
  canvas.toBlob(function (blob) {
    // Process the captured image Blob
    processCapturedImageBlob(blob);
  }, "image/png");
}

// Function to process the captured image Blob
function processCapturedImageBlob(blob) {
  // Store the image Blob
  imageBlob = blob;

  // Log the image Blob to the console
  console.log("Image captured as Blob:", blob);
}

// Speech Recognition functions

// Function to start speech recognition
function startSpeechRecognition() {
  // Start the speech recognition engine
  recognition.start();

  // Disable the start button and enable the stop button
  document.getElementById("start-speech-btn").disabled = true;
  document.getElementById("stop-speech-btn").disabled = false;
}

// Function to stop speech recognition
function stopSpeechRecognition() {
  // Stop the speech recognition engine
  recognition.stop();

  // Enable the start button and disable the stop button
  document.getElementById("start-speech-btn").disabled = false;
  document.getElementById("stop-speech-btn").disabled = true;
}

// Function to start audio recording
function startAudioRecording() {
  // Get access to the user's microphone
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      // Create a new MediaRecorder object
      mediaRecorder = new MediaRecorder(stream);

      // Set up the dataavailable event handler
      mediaRecorder.ondataavailable = function (e) {
        // Add the recorded audio data to the audioChunks array
        audioChunks.push(e.data);
      };

      // Set up the stop event handler
      mediaRecorder.onstop = function (e) {
        // Create a new Blob from the recorded audio data
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

        // Reset the audioChunks array
        audioChunks = [];

        // Create a URL for the audio Blob
        const audioUrl = URL.createObjectURL(audioBlob);

        // Set the source of the audio playback element to the recorded audio URL
        document.getElementById("audio-playback").src = audioUrl;
      };

      // Start recording audio
      mediaRecorder.start();

      // Disable the start button and enable the stop button
      document.getElementById("start-audio-record-btn").disabled = true;
      document.getElementById("stop-audio-record-btn").disabled = false;
    })
    .catch(function (err) {
      // Handle any errors that occur during audio recording
      console.error("Could not start audio recording:", err);
    });
}

// Function to stop audio recording
function stopAudioRecording() {
  // Stop the media recorder
  mediaRecorder.stop();

  // Enable the start button and disable the stop button
  document.getElementById("start-audio-record-btn").disabled = false;
  document.getElementById("stop-audio-record-btn").disabled = true;
}

// Stop the video and audio streams when navigating away from the page (optional)
window.onbeforeunload = function () {
  // Check if videoStream is defined
  if (videoStream) {
    // Stop all tracks in the video stream
    videoStream.getTracks().forEach((track) => track.stop());
  }

  // Check if mediaRecorder is defined and not in inactive state
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    // Stop all tracks in the media recorder stream
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());
  }
};

// Function to upload the captured image
function uploadImage() {
  // Check if imageBlob is defined
  if (!imageBlob) {
    // Log an error message if no image to upload
    return console.error("No image to upload.");
  }

  // Create a new FormData object
  const formData = new FormData();

  // Append the imageBlob to the FormData object
  formData.append("image", imageBlob, "image.png");

  // Make a POST request to the server to upload the image
  fetch("http://localhost:5000/upload-image", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error uploading image:", error));
}

// Function to upload audio search
function uploadAudioSearch() {
  // Get the text input element
  const textInput = document.getElementById("speech-to-text");

  // Get the input string from the text input element
  const inputString = textInput.innerText;

  // Call the uploadImageWithDescription function with the input string
  uploadImageWithDescription(inputString);
}

// Function to upload text search
function uploadTextSearch() {
  // Get the text input element
  const textInput = document.getElementById("text-to-speak");

  // Get the input string from the text input element
  const inputString = textInput.value;

  // Call the uploadImageWithDescription function with the input string
  uploadImageWithDescription(inputString);
}

// Function to upload image with description
function uploadImageWithDescription(inputString) {
  // Check if imageBlob is defined
  if (!imageBlob) {
    // Log an error message if no image to upload
    return console.error("No image to upload.");
  }

  // Create a new FormData object
  const formData = new FormData();

  // Append the imageBlob to the FormData object
  formData.append("image", imageBlob, "image.png");

  // Log the input string to the console
  console.log(inputString);

  // Append the input string as a description to the FormData object
  formData.append("description", inputString);

  // Make a POST request to the server to upload the image
  fetch("http://localhost:5000/upload-image", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      // Log the image upload response to the console
      console.log("Image uploaded:", data);

      // Update the search response element with the server's message
      document.getElementById("search-response").innerText = data.message;

      // Call the speakTextByInput function with the server's message
      speakTextByInput(data.message);
    })
    .catch((error) => console.error("Error uploading image:", error));
}

// Function to upload the audio Blob
function uploadAudio() {
  // Check if mediaRecorder is defined
  if (!mediaRecorder) {
    // Log an error message if no audio recording available to upload
    return console.error("No audio recording available to upload.");
  }

  // Create a Blob from the audio data chunks
  const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

  // Create a new FormData object
  const formData = new FormData();

  // Append the audioBlob to the FormData object
  formData.append("audio", audioBlob, "audio.wav");

  // Make a POST request to the server to upload the audio
  fetch("http://localhost:5000/upload-audio", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error uploading audio:", error));
}

// Function to start auto-capture
function startAutoCapture() {
  // Check if autoCaptureIntervalId is null
  if (autoCaptureIntervalId === null) {
    // Call the takeSnapshotAndUpload function every 10 seconds (10000 milliseconds)
    autoCaptureIntervalId = setInterval(takeSnapshotAndUpload, 10000);

    // Disable the start button and enable the stop button
    document.getElementById("start-auto-capture").disabled = true;
    document.getElementById("stop-auto-capture").disabled = false;

    // Log a message to the console indicating auto-capture has started
    console.log("Auto capture started.");
  }
}

// Function to stop auto-capture
function stopAutoCapture() {
  // Check if autoCaptureIntervalId is not null
  if (autoCaptureIntervalId !== null) {
    // Stop the interval using clearInterval
    clearInterval(autoCaptureIntervalId);

    // Clear the interval ID
    autoCaptureIntervalId = null;

    // Enable the start button and disable the stop button
    document.getElementById("start-auto-capture").disabled = false;
    document.getElementById("stop-auto-capture").disabled = true;

    // Log a message to the console indicating auto-capture has stopped
    console.log("Auto capture stopped.");
  }
}

// Function to take a snapshot and upload it to the server
function takeSnapshotAndUpload() {
  // Draw the video frame on the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the canvas data as a Blob
  canvas.toBlob(function (blob) {
    // Create a new FormData object
    const formData = new FormData();

    // Append the Blob to the FormData object with a filename
    formData.append("image", blob, `image_${Date.now()}.png`);

    // Send the Blob to the server using fetch
    fetch("http://localhost:5000/upload-walking-image", {
      // Replace with the path to your Flask endpoint
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Log the image upload response to the console
        console.log("Image uploaded:", data);

        // Update the auto-capture response element with the server's message
        document.getElementById("auto-capture-response").innerText =
          data.message;

        // Call the speakTextByInput function with the server's message
        speakTextByInput(data.message);
      })
      .catch((error) => {
        // Log any errors that occur during image upload
        console.error("Error uploading image:", error);
      });
  }, "image/png");
}

// Function to speak text
function speakText() {
  // Get the text input element
  const textInput = document.getElementById("text-to-speak");

  // Get the text value from the input element
  const text = textInput.value;

  // Check if there's any text
  if (text.trim().length === 0) {
    // Alert the user to enter some text
    alert("Please enter some text to speak.");
    // Exit the function
    return;
  }

  // Initialize a new SpeechSynthesisUtterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Set the properties for the speech
  utterance.pitch = 1; // Range between 0 (lowest) and 2 (highest), with 1 as the default.
  utterance.rate = 1; // Range between 0.1 (slowest) and 10 (fastest), with 1 as the default.
  utterance.volume = 1; // Volume level from 0 to 1.

  // Optionally, select a specific voice
  // utterance.voice = speechSynthesis.getVoices().filter(voice => voice.lang === 'en-US')[0];

  // Speak out loud
  window.speechSynthesis.speak(utterance);
}

// Function to speak text by input
function speakTextByInput(text) {
  // Check if there's any text
  if (text.trim().length === 0) {
    // Alert the user if no text is provided
    alert("No response");
    // Exit the function
    return;
  }

  // Initialize a new SpeechSynthesisUtterance with the provided text
  const utterance = new SpeechSynthesisUtterance(text);

  // Set the properties for the speech
  utterance.pitch = 1; // Set the pitch to 1 (default value)
  utterance.rate = 1; // Set the rate to 1 (default value)
  utterance.volume = 1; // Set the volume to 1 (maximum value)

  // Optionally, select a specific voice (commented out)
  // utterance.voice = speechSynthesis.getVoices().filter(voice => voice.lang === 'en-US')[0];

  // Speak out loud using the speech synthesis API
  window.speechSynthesis.speak(utterance);
}
