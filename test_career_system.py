from career_data import create_sample_career_system

def main():
    # Create the career guidance system
    system = create_sample_career_system()
    
    # Test user profile
    user_education = "Computer Science"
    user_interests = ["technology", "design", "problem solving"]
    user_skills = ["programming", "data analysis", "teamwork"]
    
    # Get career recommendations
    recommendations = system.get_recommendations(
        user_education=user_education,
        user_interests=user_interests,
        user_skills=user_skills,
        num_recommendations=5
    )
    
    # Print recommendations
    print("\nCareer Recommendations:")
    print("----------------------")
    for i, career in enumerate(recommendations, 1):
        details = system.get_career_details(career)
        print(f"\n{i}. {career}")
        print(f"   Education Branches: {', '.join(details['education_branches'])}")
        print(f"   Salary: ${details['salary']:,.2f}")
        print(f"   Demand Score: {details['demand']:.2f}")
        print(f"   Interest Score: {details['interest_score']:.2f}")
        print(f"   Related Careers: {', '.join(details['related_careers'])}")

if __name__ == "__main__":
    main() 