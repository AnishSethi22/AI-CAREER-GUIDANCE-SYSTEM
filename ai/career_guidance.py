import math
from typing import List, Dict, Tuple, Optional

class CareerNode:
    def __init__(self, name: str, education_branches: List[str], salary: float, demand: float, interest_score: float):
        self.name = name
        self.education_branches = education_branches
        self.salary = salary
        self.demand = demand
        self.interest_score = interest_score
        self.connections: List[CareerNode] = []
        
    def evaluate(self, user_education: str, user_interests: List[str], user_skills: List[str]) -> float:
        # Education match (40% weight)
        education_match = 1.0 if user_education in self.education_branches else 0.0
        
        # Interest match (30% weight)
        interest_match = sum(1 for interest in user_interests if interest.lower() in self.name.lower()) / len(user_interests)
        
        # Skill match (20% weight)
        skill_match = sum(1 for skill in user_skills if skill.lower() in self.name.lower()) / len(user_skills)
        
        # Market factors (10% weight)
        market_score = (self.demand + self.interest_score) / 2
        
        # Calculate final score
        score = (
            0.4 * education_match +
            0.3 * interest_match +
            0.2 * skill_match +
            0.1 * market_score
        )
        
        return score

class CareerGuidanceSystem:
    def __init__(self):
        self.careers: Dict[str, CareerNode] = {}
        
    def add_career_path(self, name: str, education_branches: List[str], salary: float, demand: float, interest_score: float):
        self.careers[name] = CareerNode(name, education_branches, salary, demand, interest_score)
        
    def connect_careers(self, career1: str, career2: str):
        if career1 in self.careers and career2 in self.careers:
            self.careers[career1].connections.append(self.careers[career2])
            self.careers[career2].connections.append(self.careers[career1])
            
    def get_recommendations(self, user_education: str, user_interests: List[str], user_skills: List[str], num_recommendations: int = 5) -> List[str]:
        # Calculate scores for all careers
        scores = {
            career: node.evaluate(user_education, user_interests, user_skills)
            for career, node in self.careers.items()
        }
        
        # Sort careers by score
        sorted_careers = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        # Get top recommendations
        recommendations = []
        for career, score in sorted_careers[:num_recommendations]:
            if score > 0:  # Only include careers with positive scores
                recommendations.append(career)
                
        # If we don't have enough recommendations, add related careers
        if len(recommendations) < num_recommendations:
            for career in recommendations:
                for connected_career in self.careers[career].connections:
                    if connected_career.name not in recommendations:
                        recommendations.append(connected_career.name)
                        if len(recommendations) >= num_recommendations:
                            break
                if len(recommendations) >= num_recommendations:
                    break
                    
        return recommendations[:num_recommendations]
        
    def get_career_details(self, career_name: str) -> Optional[Dict]:
        if career_name in self.careers:
            career = self.careers[career_name]
            return {
                "name": career.name,
                "education_branches": career.education_branches,
                "salary": career.salary,
                "demand": career.demand,
                "interest_score": career.interest_score,
                "related_careers": [node.name for node in career.connections]
            }
        return None 