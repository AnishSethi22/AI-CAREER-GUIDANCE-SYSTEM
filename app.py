from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import requests
import json
from career_guidance import CareerGuidanceSystem
from career_data import create_sample_career_system

app = Flask(__name__, static_folder='static')
CORS(app)

# Initialize the career guidance system
career_system = create_sample_career_system()

# Configure Groq API
GROQ_API_KEY = "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"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Define educational branches
educational_branches = {
    "Computer Science": ["Computer Science", "Information Technology", "Software Engineering", "Computer Engineering"],
    "Engineering": ["Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Chemical Engineering"],
    "Business": ["Business Administration", "Finance", "Marketing", "Economics", "Management"],
    "Design": ["Graphic Design", "Industrial Design", "Fashion Design", "Interior Design"],
    "Healthcare": ["Medicine", "Nursing", "Pharmacy", "Public Health", "Biomedical Sciences"],
    "Education": ["Education", "Early Childhood Education", "Special Education", "Educational Psychology"],
    "Arts": ["Fine Arts", "Performing Arts", "Music", "Film Studies", "Creative Writing"],
    "Sciences": ["Biology", "Chemistry", "Physics", "Mathematics", "Environmental Science"],
    "Social Sciences": ["Psychology", "Sociology", "Political Science", "Anthropology", "History"],
    "Humanities": ["Philosophy", "Literature", "Languages", "Religious Studies", "Cultural Studies"],
    "Law": ["Law", "Criminal Justice", "Legal Studies"],
    "Agriculture": ["Agricultural Science", "Food Science", "Environmental Management"],
    "Architecture": ["Architecture", "Urban Planning", "Landscape Architecture"],
    "Communication": ["Journalism", "Media Studies", "Public Relations", "Digital Media"],
    "Hospitality": ["Hotel Management", "Tourism", "Culinary Arts", "Event Management"]
}

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/api/education-branches')
def get_education_branches():
    try:
        # Flatten the educational branches into a single list
        branches = []
        for category, sub_branches in educational_branches.items():
            branches.extend(sub_branches)
        return jsonify({
            "success": True,
            "branches": sorted(branches)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/careers')
def get_all_careers():
    try:
        # Get all careers from the career system
        all_careers = list(career_system.careers.keys())
        return jsonify({
            "success": True,
            "careers": sorted(all_careers)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400

        user_education = data.get('education')
        user_interests = data.get('interests', [])
        user_skills = data.get('skills', [])
        
        if not user_education:
            return jsonify({
                "success": False,
                "error": "Education branch is required"
            }), 400

        # Convert interests string to list if it's a string
        if isinstance(user_interests, str):
            user_interests = [user_interests]
            
        # Convert skills string to list if it's a string
        if isinstance(user_skills, str):
            user_skills = [user_skills]

        recommendations = career_system.get_recommendations(
            user_education=user_education,
            user_interests=user_interests,
            user_skills=user_skills,
            num_recommendations=5
        )
        
        career_details = []
        for career in recommendations:
            details = career_system.get_career_details(career)
            if details:
                # Get AI-enhanced description using Groq
                enhanced_description = get_ai_career_description(
                    career_name=details["name"],
                    education=user_education,
                    interests=user_interests,
                    skills=user_skills
                )
                
                career_details.append({
                    "title": details["name"],
                    "description": enhanced_description,
                    "skills": details["education_branches"],
                    "salary": details["salary"],
                    "demand": details["demand"],
                    "related_careers": details["related_careers"]
                })
        
        if not career_details:
            return jsonify({
                "success": False,
                "error": "No career recommendations found"
            }), 404

        return jsonify({
            "success": True,
            "careers": career_details
        })
    except Exception as e:
        print(f"Error in get_recommendations: {str(e)}")  # Add logging
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/chat', methods=['POST'])
def chat_with_ai():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({
                "success": False,
                "error": "No message provided"
            }), 400
            
        user_message = data['message']
        
        # Create a prompt for the AI
        prompt = f"""You are a career guidance AI assistant named CareerCompass AI. 
        Your role is to provide helpful, accurate, and supportive career advice.
        
        User message: {user_message}
        
        Provide a helpful response about career guidance. Focus on being informative, 
        supportive, and practical. Include specific advice when possible.
        Keep your response concise (maximum 3 paragraphs) and focused on career guidance.
        """
        
        # Generate response using Groq
        response = generate_groq_response(prompt)
        
        return jsonify({
            "success": True,
            "response": response
        })
    except Exception as e:
        print(f"Error in chat_with_ai: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/career-details/<career_name>')
def get_career_details(career_name):
    try:
        details = career_system.get_career_details(career_name)
        if not details:
            return jsonify({
                "success": False,
                "error": "Career not found"
            }), 404
            
        # Get AI-enhanced description
        enhanced_description = get_ai_career_description(
            career_name=details["name"],
            education=details["education_branches"][0] if details["education_branches"] else "",
            interests=[],
            skills=[]
        )
        
        details["enhanced_description"] = enhanced_description
        
        return jsonify({
            "success": True,
            "career": details
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/compare-careers', methods=['POST'])
def compare_careers():
    try:
        data = request.get_json()
        if not data or 'career1' not in data or 'career2' not in data:
            return jsonify({
                "success": False,
                "error": "Two careers must be provided for comparison"
            }), 400
            
        career1_name = data['career1']
        career2_name = data['career2']
        
        # Get details for both careers
        career1 = career_system.get_career_details(career1_name)
        career2 = career_system.get_career_details(career2_name)
        
        if not career1 or not career2:
            return jsonify({
                "success": False,
                "error": "One or both careers not found"
            }), 404
            
        # Create comparison data
        comparison = {
            "career1": {
                "name": career1["name"],
                "education_branches": career1["education_branches"],
                "salary": career1["salary"],
                "demand": career1["demand"],
                "interest_score": career1["interest_score"],
                "related_careers": career1["related_careers"]
            },
            "career2": {
                "name": career2["name"],
                "education_branches": career2["education_branches"],
                "salary": career2["salary"],
                "demand": career2["demand"],
                "interest_score": career2["interest_score"],
                "related_careers": career2["related_careers"]
            },
            "comparison_factors": [
                {
                    "factor": "Salary",
                    "career1_value": f"${career1['salary']:,}",
                    "career2_value": f"${career2['salary']:,}",
                    "better": "career1" if career1["salary"] > career2["salary"] else "career2"
                },
                {
                    "factor": "Market Demand",
                    "career1_value": f"{career1['demand'] * 100:.0f}%",
                    "career2_value": f"{career2['demand'] * 100:.0f}%",
                    "better": "career1" if career1["demand"] > career2["demand"] else "career2"
                },
                {
                    "factor": "Interest Level",
                    "career1_value": f"{career1['interest_score'] * 100:.0f}%",
                    "career2_value": f"{career2['interest_score'] * 100:.0f}%",
                    "better": "career1" if career1["interest_score"] > career2["interest_score"] else "career2"
                },
                {
                    "factor": "Education Required",
                    "career1_value": ", ".join(career1["education_branches"][:2]),
                    "career2_value": ", ".join(career2["education_branches"][:2]),
                    "better": "equal"
                }
            ]
        }
        
        # Get AI-generated comparison summary
        comparison_summary = get_career_comparison_summary(career1_name, career2_name)
        comparison["summary"] = comparison_summary
        
        return jsonify({
            "success": True,
            "comparison": comparison
        })
    except Exception as e:
        print(f"Error in compare_careers: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

def generate_groq_response(prompt):
    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "system", "content": "You are CareerCompass AI, a helpful career guidance assistant."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        response = requests.post(GROQ_API_URL, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        
        result = response.json()
        return result["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error generating Groq response: {str(e)}")
        return "I'm sorry, I encountered an error. Please try again."

def get_ai_career_description(career_name, education, interests, skills):
    try:
        # Create a prompt for the AI
        interests_text = ", ".join(interests) if interests else "various fields"
        skills_text = ", ".join(skills) if skills else "various skills"
        
        prompt = f"""Generate a personalized career description for {career_name} 
        for someone with education in {education}, interests in {interests_text}, 
        and skills in {skills_text}.
        
        Include:
        1. A brief overview of the career
        2. Why it might be a good match based on their background
        3. Key skills needed to succeed
        4. Growth opportunities
        
        Keep it concise (maximum 3 paragraphs) and engaging.
        """
        
        # Generate description using Groq
        return generate_groq_response(prompt)
    except Exception as e:
        print(f"Error generating AI description: {str(e)}")
        return f"A career in {career_name} that matches your education background and interests."

def get_career_comparison_summary(career1_name, career2_name):
    try:
        prompt = f"""Compare {career1_name} and {career2_name} as career options.
        
        Include:
        1. Key differences between these careers
        2. What type of person might prefer one over the other
        3. Future outlook for both careers
        
        Keep it concise (maximum 2 paragraphs) and balanced.
        """
        
        # Generate comparison using Groq
        return generate_groq_response(prompt)
    except Exception as e:
        print(f"Error generating comparison summary: {str(e)}")
        return f"Both {career1_name} and {career2_name} offer unique opportunities and challenges. Consider your personal interests, skills, and long-term goals when choosing between them."

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)