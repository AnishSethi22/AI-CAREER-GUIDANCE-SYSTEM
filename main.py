from career_data import create_sample_career_system

def main():
    # Create the career guidance system
    system = create_sample_career_system()
    
    # Sample user profile
    user_skills = ["programming", "problem-solving", "communication", "python"]
    user_interests = ["machine learning", "data analysis", "statistics"]
    
    # Get career recommendations
    recommendations = system.get_recommendations(user_skills, user_interests)
    
    # Display results
    print("\nCareer Recommendations:")
    print("----------------------")
    for career, score in recommendations:
        print(f"{career}: {score:.2f}")

if __name__ == "__main__":
    main() 