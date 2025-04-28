// Main JavaScript for CareerCompass AI

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Add event listeners
    addEventListeners();
    
    // Load education branches
    loadEducationBranches();
    
    // Load career options for comparison
    loadCareerOptions();
    
    // Handle navigation
    handleNavigation();
});

// Initialize the application
function initApp() {
    console.log('CareerCompass AI initialized');
    
    // Show the home section by default
    showSection('home');
}

// Add event listeners
function addEventListeners() {
    // Navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
            
            // Update active link
            document.querySelectorAll('nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // CTA buttons
    document.getElementById('start-assessment').addEventListener('click', function() {
        showSection('assessment');
        document.querySelector('nav a[href="#assessment"]').classList.add('active');
        document.querySelector('nav a[href="#home"]').classList.remove('active');
    });
    
    document.getElementById('chat-with-ai').addEventListener('click', function() {
        showSection('chat');
        document.querySelector('nav a[href="#chat"]').classList.add('active');
        document.querySelector('nav a[href="#home"]').classList.remove('active');
    });
    
    // Career categories
    document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('click', function() {
            const categoryName = this.getAttribute('data-category');
            fetchCareersForCategory(categoryName);
        });
    });
    
    // Career assessment form
    document.getElementById('career-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitCareerAssessment();
    });
    
    // Career comparison button
    const compareBtn = document.getElementById('compare-btn');
    if (compareBtn) {
        compareBtn.addEventListener('click', function() {
            compareSelectedCareers();
        });
    }
}

// Show a specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main > section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the target section
    document.getElementById(sectionId).style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Load education branches from API
function loadEducationBranches() {
    fetch('/api/education-branches')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const selectElement = document.getElementById('education');
                data.branches.forEach(branch => {
                    const option = document.createElement('option');
                    option.value = branch;
                    option.textContent = branch;
                    selectElement.appendChild(option);
                });
            } else {
                console.error('Error loading education branches:', data.error);
            }
        })
        .catch(error => {
            console.error('Error fetching education branches:', error);
        });
}

// Load career options for comparison dropdowns
function loadCareerOptions() {
    fetch('/api/careers')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const career1Select = document.getElementById('career1');
                const career2Select = document.getElementById('career2');
                
                if (career1Select && career2Select) {
                    data.careers.forEach(career => {
                        // Add to first dropdown
                        const option1 = document.createElement('option');
                        option1.value = career;
                        option1.textContent = career;
                        career1Select.appendChild(option1);
                        
                        // Add to second dropdown
                        const option2 = document.createElement('option');
                        option2.value = career;
                        option2.textContent = career;
                        career2Select.appendChild(option2);
                    });
                }
            } else {
                console.error('Error loading careers:', data.error);
            }
        })
        .catch(error => {
            console.error('Error fetching careers:', error);
        });
}

// Compare selected careers
function compareSelectedCareers() {
    const career1 = document.getElementById('career1').value;
    const career2 = document.getElementById('career2').value;
    
    if (!career1 || !career2) {
        alert('Please select two careers to compare');
        return;
    }
    
    if (career1 === career2) {
        alert('Please select two different careers to compare');
        return;
    }
    
    // Show loading state
    document.getElementById('comparison-loading').classList.remove('hidden');
    document.getElementById('comparison-container').classList.add('hidden');
    
    // Prepare data for API
    const comparisonData = {
        career1: career1,
        career2: career2
    };
    
    // Call API
    fetch('/api/compare-careers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comparisonData)
    })
    .then(response => response.json())
    .then(data => {
        // Hide loading state
        document.getElementById('comparison-loading').classList.add('hidden');
        document.getElementById('comparison-container').classList.remove('hidden');
        
        if (data.success) {
            displayCareerComparison(data.comparison);
        } else {
            document.getElementById('comparison-container').innerHTML = `
                <div class="error-message">
                    <p>Error: ${data.error}</p>
                </div>
            `;
        }
    })
    .catch(error => {
        console.error('Error comparing careers:', error);
        document.getElementById('comparison-loading').classList.add('hidden');
        document.getElementById('comparison-container').classList.remove('hidden');
        document.getElementById('comparison-container').innerHTML = `
            <div class="error-message">
                <p>Error comparing careers. Please try again.</p>
            </div>
        `;
    });
}

// Display career comparison results
function displayCareerComparison(comparison) {
    // Set career names in the table header
    document.getElementById('career1-header').textContent = comparison.career1.name;
    document.getElementById('career2-header').textContent = comparison.career2.name;
    
    // Populate comparison table
    const tableBody = document.getElementById('comparison-table-body');
    tableBody.innerHTML = '';
    
    comparison.comparison_factors.forEach(factor => {
        const row = document.createElement('tr');
        
        // Factor name
        const factorCell = document.createElement('td');
        factorCell.textContent = factor.factor;
        row.appendChild(factorCell);
        
        // Career 1 value
        const career1Cell = document.createElement('td');
        if (factor.better === 'career1') {
            career1Cell.innerHTML = `<span class="highlight-better">${factor.career1_value}</span>`;
        } else {
            career1Cell.textContent = factor.career1_value;
        }
        row.appendChild(career1Cell);
        
        // Career 2 value
        const career2Cell = document.createElement('td');
        if (factor.better === 'career2') {
            career2Cell.innerHTML = `<span class="highlight-better">${factor.career2_value}</span>`;
        } else {
            career2Cell.textContent = factor.career2_value;
        }
        row.appendChild(career2Cell);
        
        tableBody.appendChild(row);
    });
    
    // Add summary
    const summaryDiv = document.getElementById('comparison-summary');
    summaryDiv.innerHTML = `
        <h4>Comparison Summary</h4>
        <p>${comparison.summary}</p>
    `;
}

// Fetch careers for a specific category
function fetchCareersForCategory(category) {
    // Show loading state
    const resultsContainer = document.getElementById('career-results');
    resultsContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading careers...</p></div>';
    
    // Sample career data (in a real application, this would come from an API)
    const careersByCategory = {
        'Technology': [
            {
                title: 'Software Engineer',
                description: 'Design, develop, and maintain software systems and applications.',
                skills: ['Programming', 'Problem-solving', 'Software design', 'Debugging'],
                salary: '$120,000',
                demand: 'High'
            },
            {
                title: 'Data Scientist',
                description: 'Analyze and interpret complex data to help organizations make better decisions.',
                skills: ['Statistics', 'Machine Learning', 'Data Analysis', 'Programming'],
                salary: '$130,000',
                demand: 'Very High'
            },
            {
                title: 'Cybersecurity Analyst',
                description: 'Protect computer systems and networks from information disclosure or theft.',
                skills: ['Network Security', 'Risk Management', 'Security Tools', 'Problem-solving'],
                salary: '$110,000',
                demand: 'High'
            }
        ],
        'Healthcare': [
            {
                title: 'Healthcare Administrator',
                description: 'Plan, direct, and coordinate medical and health services.',
                skills: ['Leadership', 'Communication', 'Healthcare Knowledge', 'Organization'],
                salary: '$100,000',
                demand: 'High'
            },
            {
                title: 'Medical Researcher',
                description: 'Conduct research aimed at improving overall human health.',
                skills: ['Scientific Research', 'Critical Thinking', 'Data Analysis', 'Technical Writing'],
                salary: '$115,000',
                demand: 'High'
            }
        ],
        'Business': [
            {
                title: 'Business Analyst',
                description: 'Analyze business needs and processes to improve efficiency and effectiveness.',
                skills: ['Data Analysis', 'Problem-solving', 'Communication', 'Business Knowledge'],
                salary: '$95,000',
                demand: 'High'
            },
            {
                title: 'Marketing Manager',
                description: 'Develop and implement marketing strategies to promote products or services.',
                skills: ['Marketing Strategy', 'Communication', 'Creativity', 'Analytics'],
                salary: '$105,000',
                demand: 'Medium-High'
            }
        ],
        'Creative': [
            {
                title: 'UX Designer',
                description: 'Design user experiences for websites, applications, and products.',
                skills: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design'],
                salary: '$110,000',
                demand: 'High'
            },
            {
                title: 'Graphic Designer',
                description: 'Create visual content to communicate messages and ideas.',
                skills: ['Visual Design', 'Typography', 'Color Theory', 'Creative Software'],
                salary: '$75,000',
                demand: 'Medium'
            }
        ],
        'Education': [
            {
                title: 'Educational Technology Specialist',
                description: 'Integrate technology into educational settings to enhance learning.',
                skills: ['Educational Technology', 'Teaching', 'Training', 'Technical Support'],
                salary: '$80,000',
                demand: 'High'
            },
            {
                title: 'Curriculum Developer',
                description: 'Design and develop educational content and materials.',
                skills: ['Curriculum Design', 'Educational Theory', 'Content Creation', 'Assessment'],
                salary: '$75,000',
                demand: 'Medium-High'
            }
        ],
        'Engineering': [
            {
                title: 'Mechanical Engineer',
                description: 'Design, develop, build, and test mechanical devices and systems.',
                skills: ['CAD Software', 'Technical Drawing', 'Problem-solving', 'Mathematics'],
                salary: '$90,000',
                demand: 'Medium-High'
            },
            {
                title: 'Electrical Engineer',
                description: 'Design, develop, and test electrical equipment and systems.',
                skills: ['Circuit Design', 'Electronics', 'Mathematics', 'Problem-solving'],
                salary: '$95,000',
                demand: 'High'
            }
        ]
    };
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        const careers = careersByCategory[category] || [];
        
        if (careers.length > 0) {
            let cardsHTML = '';
            
            careers.forEach(career => {
                let skillsHTML = '';
                career.skills.forEach(skill => {
                    skillsHTML += `<li><i class="fas fa-check-circle"></i> ${skill}</li>`;
                });
                
                cardsHTML += `
                    <div class="career-card">
                        <div class="career-card-header">
                            <h3>${career.title}</h3>
                            <p>${category}</p>
                        </div>
                        <div class="career-card-body">
                            <p>${career.description}</p>
                            <h4>Key Skills:</h4>
                            <ul>
                                ${skillsHTML}
                            </ul>
                            <div class="career-stats">
                                <p><strong>Average Salary:</strong> ${career.salary}</p>
                                <p><strong>Market Demand:</strong> ${career.demand}</p>
                            </div>
                            <button class="btn primary">Learn More</button>
                        </div>
                    </div>
                `;
            });
            
            resultsContainer.innerHTML = cardsHTML;
        } else {
            resultsContainer.innerHTML = '<p>No careers found for this category.</p>';
        }
    }, 1000);
}

// Submit career assessment form
function submitCareerAssessment() {
    // Show loading state
    document.getElementById('results-loading').classList.remove('hidden');
    document.getElementById('results-container').classList.add('hidden');
    
    // Get form data
    const education = document.getElementById('education').value;
    const interests = document.getElementById('interests').value;
    const skills = document.getElementById('skills').value;
    
    // Prepare data for API
    const formData = {
        education: education,
        interests: interests.split(',').map(item => item.trim()),
        skills: skills ? skills.split(',').map(item => item.trim()) : []
    };
    
    // Call API
    fetch('/api/recommendations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Hide loading state
        document.getElementById('results-loading').classList.add('hidden');
        document.getElementById('results-container').classList.remove('hidden');
        
        const resultsContainer = document.getElementById('recommendation-results');
        
        if (data.success && data.careers && data.careers.length > 0) {
            let resultsHTML = '';
            
            data.careers.forEach((career, index) => {
                resultsHTML += `
                    <div class="career-card">
                        <div class="career-card-header">
                            <h3>${career.title}</h3>
                            <p>Match #${index + 1}</p>
                        </div>
                        <div class="career-card-body">
                            <p>${career.description}</p>
                            <h4>Related Fields:</h4>
                            <ul>
                                ${career.skills.map(skill => `<li><i class="fas fa-check-circle"></i> ${skill}</li>`).join('')}
                            </ul>
                            <button class="btn primary">Learn More</button>
                        </div>
                    </div>
                `;
            });
            
            resultsContainer.innerHTML = resultsHTML;
        } else {
            resultsContainer.innerHTML = '<p>No career recommendations found. Try adjusting your interests or education.</p>';
        }
    })
    .catch(error => {
        console.error('Error submitting assessment:', error);
        document.getElementById('results-loading').classList.add('hidden');
        document.getElementById('results-container').classList.remove('hidden');
        document.getElementById('recommendation-results').innerHTML = '<p>Error getting recommendations. Please try again.</p>';
    });
}

// Handle navigation
function handleNavigation() {
    // Get the hash from the URL
    const hash = window.location.hash.substring(1);
    
    // If there's a hash, show that section
    if (hash) {
        showSection(hash);
        
        // Update active link
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`nav a[href="#${hash}"]`).classList.add('active');
    }
}
