from flask import Flask, request, jsonify  # Import specific modules from Flask
import tempfile  # Import the tempfile library for temporary file operations
import utils  # Import the utils library (assuming it's a custom library)
import flask  # Import the Flask library for web development
import PIL.Image  # Import the PIL Image library for image processing
import os  # Import the OS library for file operations
import google.generativeai as genai


# This code is creating a web application using the Flask framework that provides several endpoints for uploading and processing different types of files(images and audio).
# Here's an overview of what the code is doing:
# Importing necessary libraries and modules, including Google's Generative AI library, OS, PIL Image, Flask, and utils(a custom library).
# Creating a Flask application instance.
# Defining several routes for different URLs:
# '/' (root): Renders an HTML template called 'SearchAssistant_style.html'.
# '/SearchAssistant': Renders the same HTML template as the root URL.
# '/WalkingAssistant': Renders an HTML template called 'WalkingAssistant_style.html'.
# '/upload-image' (accepts POST requests): Uploads an image file and processes it using a utility function from (link unavailable)
# '/upload-walking-image' (accepts POST requests): Uploads an image file and processes it using a utility function from (link unavailable)
# '/upload-audio' (accepts POST requests): Uploads an audio file and returns a success message.
# In the '/upload-image' and '/upload-walking-image' endpoints, the code checks if the file exists, saves it to the 'uploads' directory, opens it using PIL Image, processes it using a utility function, and returns a JSON response with the result.
# In the '/upload-audio' endpoint, the code checks if the file exists, and if so, returns a JSON response with a success message.
# Finally, the code runs the Flask application in debug mode if the script is executed directly.
# Overall, this code is setting up a web application that allows users to upload and process different types of files, and provides various endpoints for these tasks.


# Import the necessary libraries and modules
# Import the Generative AI library from Google

# Create a Flask application instance
# Create a Flask app instance with the current module name
app = Flask(__name__)

# Define a route for the root URL ('/')


@app.route('/')
def index():
    """index_page"""  # A brief description of the function
    context = {}  # Initialize an empty dictionary to store context variables
    # Render the template 'SearchAssistant_style.html' with the given context
    # Render the HTML template
    return flask.render_template("SearchAssistant_style.html", **context)


# Define a route for the '/SearchAssistant' URL
@app.route('/SearchAssistant')
def searchAssistant():
    """Search Assistant Page"""  # A brief description of the function
    # Initialize an empty dictionary to store context variables
    context = {}
    # Render the template 'SearchAssistant_style.html' with the given context
    # This will render the HTML template and return it as a response
    return flask.render_template("SearchAssistant_style.html", **context)


# Define a route for the '/WalkingAssistant' URL
@app.route('/WalkingAssistant')
def walkingAssistant():
    """Walking Assistant Page"""  # A brief description of the function
    # Initialize an empty dictionary to store context variables
    context = {}
    # Render the template 'WalkingAssistant_style.html' with the given context
    # This will render the HTML template and return it as a response
    return flask.render_template("WalkingAssistant_style.html", **context)


# Define a route for the '/upload-image' URL, accepting only POST requests
@app.route('/upload-image', methods=['POST'])
def upload_image():
    """Endpoint for uploading images with descriptions"""  # A brief description of the function

    # Check if the request has an 'image' file
    if 'image' not in request.files:
        # Return an error response if no image is found
        return jsonify({'error': 'No image part in the request'}), 400

    # Get the uploaded image file and the input text description
    file = request.files['image']
    input_text = request.form['description']

    # Check if the filename is empty
    if file.filename == '':
        # Return an error response if no file is selected
        return jsonify({'error': 'No selected file'}), 400

    # Check if the file exists
    if file:
        # Ensure the 'uploads' directory exists, create it if not
        upload_dir = 'uploads'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        # Save the file with a unique name in the 'uploads' directory
        filename = os.path.join(upload_dir, file.filename)
        file.save(filename)

        # Open the saved image file using PIL library
        img = PIL.Image.open(filename)

        # Process the image using a utility function from utils.py
        msg = utils.object_finder(img, input_text)

        # Prepare response data
        response_data = {
            'message': msg
        }

        # Create a JSON response and add CORS headers
        response = jsonify(response_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        # Return the response with a 200 OK status code
        return response, 200


# Define a route for the '/upload-walking-image' URL, accepting only POST requests
@app.route('/upload-walking-image', methods=['POST'])
def upload_walking_image():
    """Endpoint for uploading walking images"""  # A brief description of the function

    # Check if the request has an 'image' file
    if 'image' not in request.files:
        # Return an error response if no image is found
        return jsonify({'error': 'No image part in the request'}), 400

    # Get the uploaded image file
    file = request.files['image']

    # Check if the filename is empty
    if file.filename == '':
        # Return an error response if no file is selected
        return jsonify({'error': 'No selected file'}), 400

    # Check if the file exists
    if file:
        # Ensure the 'uploads' directory exists, create it if not
        upload_dir = 'uploads'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        # Save the file with a unique name in the 'uploads' directory
        filename = os.path.join(upload_dir, file.filename)
        file.save(filename)

        # Open the saved image file using PIL library
        img = PIL.Image.open(filename)

        # Process the image using a utility function from utils.py
        msg = utils.blind_helper(img)
        print(msg)  # Print the message for debugging purposes

        # Prepare response data
        response_data = {
            'message': msg
        }

        # Create a JSON response and add CORS headers
        response = jsonify(response_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        # Return the response with a 200 OK status code
        return response, 200


@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    """Endpoint for uploading audio files"""
    # Check if the request has an 'audio' file
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio part in the request'}), 400

    file = request.files['audio']

    # Check if the filename is empty
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        # Prepare response data
        response_data = {
            'message': 'Audio successfully uploaded'
        }

        # Create a JSON response and add CORS headers
        response = jsonify(response_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200


if __name__ == '__main__':
    # Run the Flask application in debug mode
    app.run(debug=True)
