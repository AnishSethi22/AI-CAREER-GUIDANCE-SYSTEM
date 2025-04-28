from career_guidance import CareerGuidanceSystem

def create_sample_career_system() -> CareerGuidanceSystem:
    system = CareerGuidanceSystem()
    
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
    
    # Add career paths with their educational branches
    # Technology
    system.add_career_path(
        "Software Engineer",
        educational_branches["Computer Science"],
        120000,
        0.90,
        0.80
    )
    
    system.add_career_path(
        "Data Scientist",
        educational_branches["Computer Science"] + educational_branches["Sciences"],
        130000,
        0.95,
        0.85
    )
    
    system.add_career_path(
        "Product Manager",
        educational_branches["Business"] + educational_branches["Computer Science"],
        140000,
        0.85,
        0.75
    )
    
    # Creative
    system.add_career_path(
        "UX Designer",
        educational_branches["Design"] + educational_branches["Computer Science"] + educational_branches["Social Sciences"],
        110000,
        0.80,
        0.70
    )
    
    system.add_career_path(
        "Graphic Designer",
        educational_branches["Design"] + educational_branches["Arts"],
        75000,
        0.75,
        0.65
    )
    
    # Business
    system.add_career_path(
        "Business Analyst",
        educational_branches["Business"] + educational_branches["Computer Science"],
        95000,
        0.85,
        0.75
    )
    
    system.add_career_path(
        "Marketing Manager",
        educational_branches["Business"] + educational_branches["Communication"],
        105000,
        0.80,
        0.70
    )
    
    # Healthcare
    system.add_career_path(
        "Healthcare Administrator",
        educational_branches["Healthcare"] + educational_branches["Business"],
        100000,
        0.85,
        0.75
    )
    
    system.add_career_path(
        "Medical Researcher",
        educational_branches["Healthcare"] + educational_branches["Sciences"],
        115000,
        0.90,
        0.80
    )
    
    # Education
    system.add_career_path(
        "Educational Technology Specialist",
        educational_branches["Education"] + educational_branches["Computer Science"],
        80000,
        0.80,
        0.85
    )
    
    system.add_career_path(
        "Curriculum Developer",
        educational_branches["Education"] + educational_branches["Social Sciences"],
        75000,
        0.75,
        0.80
    )
    
    # Connect related careers
    system.connect_careers("Software Engineer", "Data Scientist")
    system.connect_careers("Software Engineer", "Product Manager")
    system.connect_careers("UX Designer", "Graphic Designer")
    system.connect_careers("Business Analyst", "Marketing Manager")
    system.connect_careers("Healthcare Administrator", "Medical Researcher")
    system.connect_careers("Educational Technology Specialist", "Curriculum Developer")
    
    return system