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

const MOODS = {
    idle: '🤖',
    active: '🟢',
    listening: '🎧',
    thinking: '💭',
    speaking: '🗣️',
    angry: '😠',
    happy: '😄'
};

function setAIMood(mood) {
    const moodElem = document.getElementById('aiMood');
    if (moodElem) {
        moodElem.textContent = mood;
        moodElem.classList.remove('mood-animate');
        // Force reflow to restart animation
        void moodElem.offsetWidth;
        moodElem.classList.add('mood-animate');
        console.log('AI Mood set to:', mood); // Debug log
    } else {
        console.warn('AI Mood element not found!');
    }
}


// Example: Change mood on call start/end
async function startCall() {
    isCallActive = true;
    document.getElementById('callStatus').textContent = 'Call in progress...';
    document.getElementById('voiceWave').style.display = 'flex';

    startSessionTimer();
    setAIMood(MOODS.active); // Active

    setTimeout(() => {
        addMessage('AI Agent', 'Call connected! How can I assist you today?', 'ai');
    }, 1000);

    if (typeof startAIConversation === "function") startAIConversation();
}

async function endCall() {
    isCallActive = false;
    document.getElementById('callStatus').textContent = 'Call ended';
    document.getElementById('voiceWave').style.display = 'none';

    stopSessionTimer();
    setAIMood(MOODS.idle); // Idle/Happy

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
        setAIMood(MOODS.listening); // Show listening while user is sending

        addMessage('You', message, 'user');
        input.value = '';

        // Detect angry mood
        if (/abuse|badword|idiot|stupid/i.test(message)) {
            setAIMood(MOODS.angry);
            setTimeout(() => setAIMood(MOODS.idle), 1500);
            return; // Stop further processing
        }

        // Detect happy mood
        if (/thank|great|awesome|good|nice|love/i.test(message)) {
            setAIMood(MOODS.happy);
            setTimeout(() => setAIMood(MOODS.idle), 1500);
            // Optionally, you can return here if you don't want AI to respond to happy messages
            return;
        }

        // Thinking before AI responds
        setTimeout(() => {
            setAIMood(MOODS.thinking);

            setTimeout(() => {
                setAIMood(MOODS.speaking);
                addMessage('AI Agent', 'Here is my response!', 'ai');
                setTimeout(() => setAIMood(MOODS.idle), 1500);
            }, 1200);

        }, 400);
    }
}

document.getElementById('messageInput').addEventListener('input', function () {
    if (this.value.trim().length > 0) {
        setAIMood(MOODS.listening);
    } else {
        setAIMood(MOODS.idle);
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