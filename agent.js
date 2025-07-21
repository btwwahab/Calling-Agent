// 🔄 Handle Voice Input
function startVoiceInput(callback) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = async (event) => {
    const userText = event.results[0][0].transcript;
    console.log("User said:", userText);
    if (callback) callback(userText);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.start();
}

// 🧠 Query Groq AI
async function askGroq(userMessage) {
  try {
    const res = await fetch('/api/groq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage }),
    });

    const data = await res.json();
    if (data.content) return data.content;
    return "Sorry, I couldn't connect to the AI.";
  } catch (err) {
    console.error("Groq API error:", err);
    return "Sorry, I couldn't connect to the AI.";
  }
}

// 🔊 Speak Text
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

// 🚀 Combine: Voice Input → Groq → Voice Output
let aiCallActive = false; // Track if AI call is running

function speak(text, onEnd) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  if (typeof onEnd === "function") {
    utterance.onend = onEnd;
  }
  speechSynthesis.speak(utterance);
}

function startAIConversation() {
  aiCallActive = true;
  async function conversationLoop() {
    if (!aiCallActive) return;
    if (window.isMuted) {
      setTimeout(conversationLoop, 500);
      return;
    }
    // Set listening mood before starting voice input
    setAIMood(MOODS.listening);
    startVoiceInput(async (userMessage) => {
      addMessage('You', userMessage, 'user');

      // Mood detection for angry/happy
      if (/abuse|badword|idiot|stupid/i.test(userMessage)) {
        setAIMood(MOODS.angry);
        setTimeout(() => setAIMood(MOODS.idle), 1500);
        if (aiCallActive) conversationLoop();
        return;
      }
      if (/thank|great|awesome|good|nice|love/i.test(userMessage)) {
        setAIMood(MOODS.happy);
        setTimeout(() => setAIMood(MOODS.idle), 1500);
        if (aiCallActive) conversationLoop();
        return;
      }

      // Thinking mood before AI responds
      setAIMood(MOODS.thinking);
      const aiResponse = await askGroq(userMessage);

      // Speaking mood while AI is speaking
      setAIMood(MOODS.speaking);
      addMessage('AI Agent', aiResponse, 'ai');
      speak(aiResponse, () => {
        setAIMood(MOODS.idle);
        if (aiCallActive) conversationLoop();
      });
    });
  }
  conversationLoop();
}

function stopAIConversation() {
  aiCallActive = false;
  window.speechSynthesis.cancel();
}