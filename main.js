// main.js

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Call functionality
let isCallActive = false;
let isMuted = false;

document.getElementById('startCall').addEventListener('click', function () {
    if (!isCallActive) {
        startCall();
    }
});

document.getElementById('endCall').addEventListener('click', function () {
    if (isCallActive) {
        endCall();
    }
});

document.getElementById('muteBtn').addEventListener('click', function () {
    toggleMute();
});

async function startCall() {
    isCallActive = true;
    document.getElementById('callStatus').textContent = 'Call in progress...';
    document.getElementById('voiceWave').style.display = 'flex';

    // REMOVE Agora logic block here

    setTimeout(() => {
        addMessage('AI Agent', 'Call connected! How can I assist you today?', 'ai');
    }, 1000);

    if (typeof startAIConversation === "function") startAIConversation();
}

async function endCall() {
    isCallActive = false;
    document.getElementById('callStatus').textContent = 'Call ended';
    document.getElementById('voiceWave').style.display = 'none';

    // REMOVE Agora cleanup block here

    setTimeout(() => {
        document.getElementById('callStatus').textContent = 'Waiting for call...';
    }, 3000);

    if (typeof stopAIConversation === "function") stopAIConversation();
}

// Update toggleMute to use above
function toggleMute() {
    isMuted = !isMuted;
    window.isMuted = isMuted;
    const muteBtn = document.getElementById('muteBtn');
    const icon = muteBtn.querySelector('i');
    if (isMuted) {
        icon.className = 'fas fa-microphone-slash';
        muteBtn.style.background = 'linear-gradient(45deg, #f44336, #da190b)';
    } else {
        icon.className = 'fas fa-microphone';
        muteBtn.style.background = 'var(--glass-bg)';
    }
}


// Message functionality
document.getElementById('sendMessage').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (message) {
        addMessage('You', message, 'user');
        input.value = '';

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                'I understand your concern. Let me help you with that.',
                'That\'s a great question! Here\'s what I think...',
                'I\'m processing your request. Please give me a moment.',
                'Based on what you\'ve told me, I recommend...',
                'Thank you for that information. How else can I assist?'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage('AI Agent', randomResponse, 'ai');
        }, 1000 + Math.random() * 2000);
    }
}

function addMessage(sender, text, type) {
    const conversationArea = document.getElementById('conversationArea');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;

    conversationArea.appendChild(messageDiv);
    conversationArea.scrollTop = conversationArea.scrollHeight;
}

function setTotalCalls(count) {
    document.getElementById('totalCalls').textContent = count.toLocaleString();
}

function setSatisfaction(percent) {
    document.getElementById('satisfaction').textContent = percent + '%';
}

// Example usage:
setTotalCalls(1247);    
setSatisfaction(98);  

// You can update these dynamically, for example:
function incrementTotalCalls() {
    let current = parseInt(document.getElementById('totalCalls').textContent.replace(/,/g, ''));
    setTotalCalls(current + 1);
}

// Call incrementTotalCalls() whenever a call is completed

// Initialize
createParticles();