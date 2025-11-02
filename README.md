# CareerCompass AI

CareerCompass AI is an intelligent, web-based career guidance system designed to help users discover their ideal career paths. It provides personalized recommendations, career comparisons, and an interactive AI chatbot for career advice.

## Collaborators

This project was a collaborative effort by:

* **Anish Sethi** ([GitHub Profile](https://github.com/AnishSethi22))
* **[Ishaan Sahu]** ([GitHub Profile](https://github.com/ishaansahu22))

## Features

* **Personalized Career Assessment**: Recommends careers based on the user's education, interests, and skills.
* **AI Chatbot**: A chat interface powered by the Groq API (using Llama 3) to answer career-related questions in real-time.
* **Compare Careers**: A tool to compare two different careers side-by-side, looking at factors like salary, market demand, and required education.
* **Explore Careers**: Browse a database of careers, including details on salary, demand, and related fields.
* **Dynamic Frontend**: A responsive user interface built with HTML, CSS, and JavaScript.

## Tech Stack

### Backend
* **Python**
* **Flask**: Micro web framework for the API.
* **Groq API**: Powers the AI chatbot using the `llama3-8b-8192` model.
* **Requests**: For making HTTP requests to the Groq API.

### Frontend
* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**: For dynamic content, API fetching, and chat functionality.

### Core Logic
* The career recommendation engine is built on a custom `CareerGuidanceSystem` using `CareerNode` objects to map and score career paths against user profiles.

## How to Run

1.  **Clone the repository:**
    ```sh
    git clone [your-repo-url]
    cd AI-CAREER-GUIDANCE-SYSTEM
    ```

2.  **Create and activate a virtual environment:**
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install the required dependencies:**
    ```sh
    pip install -r requirements.txt
    ```
    *This will install Flask, Flask-CORS, requests, and other necessary libraries.*

4.  **Set up API Keys:**
    The application uses the Groq API. You will need to get an API key from [Groq](https://groq.com/).
    
    The key is currently hardcoded in `app.py`. For better security, it's recommended to use a `.env` file (since `python-dotenv` is in `requirements.txt`):
    
    * Create a file named `.env` in the root directory.
    * Add your API key to it:
        ```
        GROQ_API_KEY="your_actual_groq_api_key"
        ```
    * *(You would then modify `app.py` to load this key using `os.getenv("GROQ_API_KEY")`)*

5.  **Run the application:**
    ```sh
    python app.py
    ```
    The application will be running on `http://127.0.0.1:5000/`.
