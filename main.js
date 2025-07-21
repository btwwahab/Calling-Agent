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

let sessionTimer = null;
let sessionSeconds = 0;

function startSessionTimer() {
    sessionSeconds = 0;
    updateSessionDuration();
    sessionTimer = setInterval(() => {
        sessionSeconds++;
        updateSessionDuration();
    }, 1000);
}

function stopSessionTimer() {
    clearInterval(sessionTimer);
}

function updateSessionDuration() {
    const mins = String(Math.floor(sessionSeconds / 60)).padStart(2, '0');
    const secs = String(sessionSeconds % 60).padStart(2, '0');
    document.getElementById('sessionDuration').textContent = `${mins}:${secs}`;
}

// Lottie URLs for different moods (replace with your own if needed)
const lottieMoods = {
    idle: "https://lottie.host/9bb32081-1364-4149-9af4-5b4e7821f5cb/ASDvnjXfe2.lottie",
    happy: "https://lottie.host/6501da34-18bb-4610-bb8a-4bb1bbcc642e/VfBQpR4f2W.lottie",
    listening: "https://lottie.host/dced077b-570a-4763-a512-649aa1b6b721/mvfQAhD3Ev.lottie",
    thinking: "https://lottie.host/84a3eab2-0bca-496c-a405-18b058f319d6/fNeG2cBfRa.lottie",
    sad: "https://lottie.host/8decccb4-c7fc-489d-a3a5-a118f8ef0da6/JZuxecEWbA.lottie",
    angry: "https://lottie.host/f74e5da3-b83e-45ea-a300-1261f75778a6/zJazXYoNsA.lottie",
    speak: "https://lottie.host/9b64afe1-4ff2-4050-a2f9-c2662d8f4cf2/UDi1UEQAvw.lottie"
};

// Set AI Mood by changing Lottie animation
function setAIMood(mood) {
    const lottie = document.getElementById('aiMood');
    if (!lottie) return;
    // fallback to idle if mood not found
    lottie.setAttribute('src', lottieMoods[mood] || lottieMoods.idle);
}

window.addEventListener('DOMContentLoaded', () => {
    setAIMood('idle');
});

// Example: Change mood on call start/end
async function startCall() {
    isCallActive = true;
    document.getElementById('callStatus').textContent = 'Call in progress...';
    document.getElementById('voiceWave').style.display = 'flex';

    startSessionTimer();
    setAIMood('listening'); // Show listening when call starts

    setTimeout(() => {
        addMessage('AI Agent', 'Call connected! How can I assist you today?', 'ai');
        setAIMood('happy'); // Happy after greeting
    }, 1000);

    if (typeof startAIConversation === "function") startAIConversation();
}

async function endCall() {
    isCallActive = false;
    document.getElementById('callStatus').textContent = 'Call ended';
    document.getElementById('voiceWave').style.display = 'none';

    stopSessionTimer();
    setAIMood('idle'); // Back to idle

    setTimeout(() => {
        document.getElementById('callStatus').textContent = 'Waiting for call...';
    }, 3000);

    if (typeof stopAIConversation === "function") stopAIConversation();
}

// Update mood based on user message content
function updateAIMoodByMessage(message) {
    const msg = message.toLowerCase();
    // Abusive/violation detection (simple example, expand as needed)
    if (msg.match(/(stupid|idiot|hate|dumb|fool|shut up|abuse|badword)/)) {
        setAIMood("angry");
    } else if (msg.includes('thank') || msg.includes('great') || msg.includes('good') || msg.includes('awesome') || msg.includes('nice') || msg.includes('friend')) {
        setAIMood("happy");
    } else if (msg.includes('why') || msg.includes('how') || msg.includes('what') || msg.includes('where')) {
        setAIMood("thinking");
    } else {
        setAIMood("listening");
    }
}

// When user sends a message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (message) {
        addMessage('You', message, 'user');
        setAIMood('thinking'); // Show thinking while AI prepares response

        // Detect mood from user message (angry/happy/etc)
        setTimeout(() => {
            updateAIMoodByMessage(message);
        }, 500);

        input.value = '';

        // Simulate AI response
        setTimeout(() => {
            setAIMood('speak'); // AI is speaking/responding

            const responses = [
                'I understand your concern. Let me help you with that.',
                'That\'s a great question! Here\'s what I think...',
                'I\'m processing your request. Please give me a moment.',
                'Based on what you\'ve told me, I recommend...',
                'Thank you for that information. How else can I assist?'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage('AI Agent', randomResponse, 'ai');

            // After AI speaks, show happy if positive, else idle
            setTimeout(() => {
                setAIMood('happy');
            }, 1500);
        }, 1200 + Math.random() * 1000);
    }
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


function addMessage(sender, text, type) {
    const conversationArea = document.getElementById('conversationArea');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;

    conversationArea.appendChild(messageDiv);
    conversationArea.scrollTop = conversationArea.scrollHeight;
}

function setSatisfaction(percent) {
    document.getElementById('satisfaction').textContent = percent + '%';
}

// Initialize
createParticles();