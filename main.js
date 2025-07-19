// main.js

// Agora config
let AGORA_APP_ID = '';
fetch('/api/agora')
  .then(res => res.json())
  .then(data => { AGORA_APP_ID = data.appId; });
const CHANNEL_NAME = 'groqVoice';
let agoraClient;
let localAudioTrack;
let remoteUsers = {};

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

    // Agora logic
    try {
        console.log("⏳ Connecting to Agora...");
        agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        await agoraClient.join(AGORA_APP_ID, CHANNEL_NAME, null, null);
        localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        await agoraClient.publish([localAudioTrack]);
        console.log("✅ Agora audio connected");
    } catch (error) {
        console.error("Agora Init Error:", error);
    }

    setTimeout(() => {
        addMessage('AI Agent', 'Call connected! How can I assist you today?', 'ai');
    }, 1000);

    if (typeof startAIConversation === "function") startAIConversation();
}

async function endCall() {
    isCallActive = false;
    document.getElementById('callStatus').textContent = 'Call ended';
    document.getElementById('voiceWave').style.display = 'none';

    // Agora cleanup
    try {
        if (localAudioTrack) {
            localAudioTrack.stop();
            localAudioTrack.close();
        }
        if (agoraClient) {
            await agoraClient.leave();
            console.log("👋 Left Agora channel.");
        }
        speak("Thank you for the call. Goodbye!");
    } catch (error) {
        console.error("End Call Error:", error);
    }

    setTimeout(() => {
        document.getElementById('callStatus').textContent = 'Waiting for call...';
    }, 3000);

    if (typeof stopAIConversation === "function") stopAIConversation();
}

// Mute/Unmute
function muteMic() {
    if (localAudioTrack) {
        localAudioTrack.setEnabled(false);
        console.log("🎤 Muted");
    }
    isMuted = true;
    window.isMuted = true;
}

function unmuteMic() {
    if (localAudioTrack) {
        localAudioTrack.setEnabled(true);
        console.log("🎙️ Unmuted");
    }
    isMuted = false;
    window.isMuted = false;
}

// Update toggleMute to use above
function toggleMute() {
    if (isMuted) {
        unmuteMic();
        const muteBtn = document.getElementById('muteBtn');
        const icon = muteBtn.querySelector('i');
        icon.className = 'fas fa-microphone';
        muteBtn.style.background = 'var(--glass-bg)';
    } else {
        muteMic();
        const muteBtn = document.getElementById('muteBtn');
        const icon = muteBtn.querySelector('i');
        icon.className = 'fas fa-microphone-slash';
        muteBtn.style.background = 'linear-gradient(45deg, #f44336, #da190b)';
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
setTotalCalls(1247);      // Initial value
setSatisfaction(98);      // Initial value

// You can update these dynamically, for example:
function incrementTotalCalls() {
    let current = parseInt(document.getElementById('totalCalls').textContent.replace(/,/g, ''));
    setTotalCalls(current + 1);
}

// Call incrementTotalCalls() whenever a call is completed

// Initialize
createParticles();