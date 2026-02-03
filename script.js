// Initialize users array from localStorage or create empty array
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Get current logged-in user
function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Save current user
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Demo bot responses
const botResponses = [
    "That's interesting! Tell me more about that.",
    "I understand what you're saying. How can I assist you further?",
    "Great question! Let me think about that for a moment.",
    "I'm here to help! Is there anything specific you'd like to know?",
    "That's a good point. What else would you like to discuss?",
    "I appreciate you sharing that with me!",
    "Interesting perspective! I'd love to hear more.",
    "I'm always learning from our conversations. What else is on your mind?",
    "That sounds fascinating! Can you elaborate?",
    "I'm processing that information. How can I help you today?",
    "Thanks for chatting with me! What would you like to talk about?",
    "I'm here 24/7 to assist you. What can I do for you?",
    "That's a thoughtful question. Let me help you with that.",
    "I see where you're coming from. Any other questions?",
    "You've got my attention! What else would you like to know?"
];

// Get random bot response
function getBotResponse() {
    return botResponses[Math.floor(Math.random() * botResponses.length)];
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Show success message
function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
    }
}

// Hide message
function hideMessage(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// Registration Form Handler
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        hideMessage('errorMessage');
        hideMessage('successMessage');
        
        // Validation
        if (!username || !password || !confirmPassword) {
            showError('errorMessage', 'All fields are required!');
            return;
        }
        
        if (username.length < 3) {
            showError('errorMessage', 'Username must be at least 3 characters long!');
            return;
        }
        
        if (password.length < 6) {
            showError('errorMessage', 'Password must be at least 6 characters long!');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('errorMessage', 'Passwords do not match!');
            return;
        }
        
        // Check if user already exists
        const users = getUsers();
        const userExists = users.some(user => user.username === username);
        
        if (userExists) {
            showError('errorMessage', 'Username already exists! Please choose a different username.');
            return;
        }
        
        // Register new user
        users.push({ username, password });
        saveUsers(users);
        
        showSuccess('successMessage', 'Registration successful! Redirecting to login...');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
}

// Login Form Handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        hideMessage('errorMessage');
        
        // Validation
        if (!username || !password) {
            showError('errorMessage', 'All fields are required!');
            return;
        }
        
        // Check credentials
        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            showError('errorMessage', 'Invalid username or password!');
            return;
        }
        
        // Login successful
        setCurrentUser({ username });
        window.location.href = 'home.html';
    });
}

// Chat functionality
if (document.getElementById('chatForm')) {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'index.html';
    } else {
        // Display username
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = currentUser.username;
        }
        
        // Load chat history
        loadChatHistory();
        
        // Handle chat form submission
        document.getElementById('chatForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const messageInput = document.getElementById('messageInput');
            const message = messageInput.value.trim();
            
            if (!message) return;
            
            // Add user message
            addMessage(message, 'user');
            
            // Clear input
            messageInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate bot response delay
            setTimeout(() => {
                removeTypingIndicator();
                const botResponse = getBotResponse();
                addMessage(botResponse, 'bot');
                saveChatHistory();
            }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        });
    }
}

// Add message to chat
function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const p = document.createElement('p');
    p.textContent = text;
    
    bubbleDiv.appendChild(p);
    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const dotsDiv = document.createElement('div');
    dotsDiv.className = 'typing-dots';
    dotsDiv.innerHTML = '<span></span><span></span><span></span>';
    
    bubbleDiv.appendChild(dotsDiv);
    typingDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(typingDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Save chat history
function saveChatHistory() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const chatMessages = document.getElementById('chatMessages');
    const messages = [];
    
    chatMessages.querySelectorAll('.message:not(.typing-indicator)').forEach(messageDiv => {
        const text = messageDiv.querySelector('p').textContent;
        const sender = messageDiv.classList.contains('user-message') ? 'user' : 'bot';
        messages.push({ text, sender });
    });
    
    localStorage.setItem(`chat_${currentUser.username}`, JSON.stringify(messages));
}

// Load chat history
function loadChatHistory() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const chatHistory = localStorage.getItem(`chat_${currentUser.username}`);
    if (!chatHistory) return;
    
    const messages = JSON.parse(chatHistory);
    const chatMessages = document.getElementById('chatMessages');
    
    // Clear default message
    chatMessages.innerHTML = '';
    
    // Load all messages
    messages.forEach(msg => {
        addMessage(msg.text, msg.sender);
    });
}

// Logout function
function logout() {
    window.location.href = 'logout.html';
}

// Protect chat page
if (window.location.pathname.includes('home.html')) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html';
    }
}
