// Chat functionality for CareerCompass AI

document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat
    initChat();
});

// Initialize chat functionality
function initChat() {
    const sendButton = document.getElementById('send-message');
    const userInput = document.getElementById('user-message');
    const chatMessages = document.getElementById('chat-messages');
    
    // Add event listener for send button
    sendButton.addEventListener('click', function() {
        sendMessage();
    });
    
    // Add event listener for Enter key
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Function to send message
    function sendMessage() {
        const message = userInput.value.trim();
        
        if (message) {
            // Add user message to chat
            addUserMessage(message);
            
            // Clear input
            userInput.value = '';
            
            // Send message to AI and get response
            sendMessageToAI(message);
        }
    }
    
    // Add user message to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user';
        messageElement.innerHTML = `
            <div class="avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Add bot message to chat
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot';
        messageElement.innerHTML = `
            <div class="avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Send message to AI and get response
    function sendMessageToAI(message) {
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot typing';
        typingIndicator.innerHTML = `
            <div class="avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>Typing<span class="dot-typing">...</span></p>
            </div>
        `;
        
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();
        
        // Prepare data for API
        const requestData = {
            message: message
        };
        
        // Call API
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);
            
            if (data.success) {
                // Add bot response
                addBotMessage(data.response);
            } else {
                // Add error message
                addBotMessage('Sorry, I encountered an error. Please try again.');
                console.error('Error from chat API:', data.error);
            }
        })
        .catch(error => {
            // Remove typing indicator
            if (typingIndicator.parentNode === chatMessages) {
                chatMessages.removeChild(typingIndicator);
            }
            
            // Add error message
            addBotMessage('Sorry, I encountered an error. Please try again.');
            console.error('Error sending message to AI:', error);
            
            // If API is not available yet, use fallback responses
            handleFallbackResponse(message);
        });
    }
    
    // Fallback responses when API is not available
    function handleFallbackResponse(message) {
        const lowercaseMessage = message.toLowerCase();
        let response;
        
        if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
            response = 'Hello! How can I help with your career questions today?';
        } else if (lowercaseMessage.includes('career') && (lowercaseMessage.includes('advice') || lowercaseMessage.includes('guidance'))) {
            response = 'For career guidance, I recommend starting with our assessment tool. It will help identify careers that match your skills and interests. Would you like to know more about a specific career field?';
        } else if (lowercaseMessage.includes('software') || lowercaseMessage.includes('programming') || lowercaseMessage.includes('developer')) {
            response = 'Software development is a growing field with many opportunities. Key skills include programming languages like Python, JavaScript, and Java, problem-solving abilities, and teamwork. The average salary for software engineers is around $120,000 per year, with high demand across industries.';
        } else if (lowercaseMessage.includes('data science') || lowercaseMessage.includes('data analyst')) {
            response = 'Data Science combines statistics, mathematics, and programming to extract insights from data. To succeed in this field, you should develop skills in Python, R, SQL, machine learning, and data visualization. The average salary is approximately $130,000 with very high market demand.';
        } else if (lowercaseMessage.includes('healthcare') || lowercaseMessage.includes('medical')) {
            response = 'Healthcare careers offer stability and meaningful work. Options range from direct patient care (doctors, nurses) to administrative roles (healthcare managers) and technical positions (medical researchers, technicians). Most require specialized education but provide excellent job security.';
        } else if (lowercaseMessage.includes('education') || lowercaseMessage.includes('teaching')) {
            response = 'Education careers include teaching, administration, curriculum development, and educational technology. These roles typically require a bachelor\'s degree, with many positions requiring master\'s degrees. While salaries vary, these careers offer meaningful impact and work-life balance.';
        } else if (lowercaseMessage.includes('skill') || lowercaseMessage.includes('learn')) {
            response = 'Developing in-demand skills is crucial for career success. Consider technical skills like programming, data analysis, or digital marketing, along with soft skills such as communication, problem-solving, and adaptability. Online platforms like Coursera, Udemy, and LinkedIn Learning offer excellent resources for skill development.';
        } else if (lowercaseMessage.includes('interview') || lowercaseMessage.includes('resume')) {
            response = 'For successful interviews, research the company, prepare examples of your achievements, practice common questions, and prepare thoughtful questions to ask. For resumes, highlight relevant achievements, use action verbs, quantify results when possible, and tailor your resume to each job application.';
        } else if (lowercaseMessage.includes('thank')) {
            response = 'You\'re welcome! Feel free to ask if you have any other questions about career guidance.';
        } else {
            response = 'I\'m here to help with career guidance questions. You can ask about specific careers, skills to develop, education requirements, or take our career assessment for personalized recommendations.';
        }
        
        // Add bot response after a short delay to simulate thinking
        setTimeout(() => {
            addBotMessage(response);
        }, 1000);
    }
    
    // Scroll chat to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}
