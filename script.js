// Navigation scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll reveal animation
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Optional: stop observing once revealed
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// AI Chat Logic
const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatContainer = document.getElementById('chatContainer');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatMessages = document.getElementById('chatMessages');

if (chatToggleBtn) {
    chatToggleBtn.addEventListener('click', () => {
        chatContainer.classList.add('active');
    });
}

if (closeChatBtn) {
    closeChatBtn.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });
}

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if (sender === 'user') {
        messageDiv.classList.add('user-message');
    } else {
        messageDiv.classList.add('ai-message');
    }
    
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'ai-message');
    loadingDiv.id = 'loadingMessage';
    loadingDiv.innerHTML = '<span class="loading-dots">思考中</span>';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingDiv;
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    chatInput.value = '';

    const loadingDiv = appendLoading();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        chatMessages.removeChild(loadingDiv);
        
        if (response.ok) {
            appendMessage(data.response, 'ai');
        } else {
            appendMessage('抱歉，發生了錯誤：' + (data.error || '無法連接到伺服器。'), 'ai');
        }
    } catch (error) {
        chatMessages.removeChild(loadingDiv);
        appendMessage('抱歉，網路連線發生問題。', 'ai');
    }
}

if (sendChatBtn) {
    sendChatBtn.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}
