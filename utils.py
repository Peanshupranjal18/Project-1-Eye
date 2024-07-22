# Import necessary libraries
import PIL.Image  # For image processing
import google.generativeai as genai  # To interact with Google's Generative AI
import os  # For environment variable operations

# Set the Google API key as an environment variable
os.environ["GOOGLE_API_KEY"] = "AIzaSyAvPMmH_dpYbRGttettqQUn3QWwZIdRHEk"
# Configure the genai library with the API key
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])


def object_finder(img, prompt=""):
    """
    Function to identify and locate objects in an image for vision-impaired users.

    Parameters:
    img (PIL.Image): An image in which objects need to be located.
    prompt (str): Optional additional prompt for the AI.

    Returns:
    str: Description of the objects' locations and access instructions.
    """
    # Define the system prompt for the object finder
    prompt_find_sys = (
        "You are a helpful agent for vision impaired people. "
        "Your task is to locate the things in the room and provide details "
        "about how it can be fetched. Let's think step by step."
    )

    # Initialize the Generative AI model with the system prompt
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest',
                                  system_instruction=prompt_find_sys)
    # Generate content based on the prompt and image
    response = model.generate_content([prompt, img])
    # Return the generated text
    return response.text


def blind_helper(img, prompt=""):
    """
    Function to provide guidance for vision-impaired individuals based on an image of their surroundings.

    Parameters:
    img (PIL.Image): An image showing the view in front of the user.
    prompt (str): Optional additional prompt for the AI.

    Returns:
    str: Specific details about the surroundings, potential hazards, and navigation advice.
    """
    # Define the system prompt for the blind helper
    # This prompt is being send to the Google Gemini API for processing the image respectively
    prompt_blind_sys = (
        "You are a walking assistant, you give directions to follow based on pictures provided in order to not collide with anything."
        "You must give verbose responses in order for the user to react in time to any obstructions in front of them."
        "I am a vision impaired. This picture shows what is in front of me. "
        "Please tell me which way I can safely walk. Give me walking directions before you tell me any other information about my surroundings."
    )

    # Initialize the Generative AI model with the system prompt
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest',
                                  system_instruction=prompt_blind_sys)
    # Generate content based on the prompt and image
    response = model.generate_content([prompt, img])
    # Return the generated text
    return response.text
