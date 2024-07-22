# Import the necessary libraries and modules
# Import the Generative AI library from Google
import google.generativeai as genai
import os  # Import the OS library for file operations
import PIL.Image  # Import the PIL Image library for image processing
import flask  # Import the Flask library for web development
import utils  # Import the utils library (assuming it's a custom library)
import tempfile  # Import the tempfile library for temporary file operations
from flask import Flask, request, jsonify  # Import specific modules from Flask

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
