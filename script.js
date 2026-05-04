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

const GEMINI_API_KEY = "請替換為您的_GEMINI_API_KEY"; // ⚠️ 注意：不要將您的真實 API Key 上傳到公開的 GitHub！

const PERSONAL_INFO = `你現在是 吳佩馨 的專屬 AI 助理，負責在她的個人網站上回答訪客的問題。你的語氣要專業、友善，並且能清楚介紹她的資訊。
以下是 吳佩馨 的個人資訊：

【基本介紹】
姓名：吳佩馨
身分：具備財務金融與資訊科學的雙重學術背景，專注於透過量化分析與機器學習模型解決複雜的金融問題。
特點：結合數據科學與量化金融，探索市場趨勢的創新解方

【核心專長】
1. 量化分析與財務工程：專注於投資組合建構、衍生性金融商品定價與選擇權交易策略開發。善於解讀總經數據，並將市場資訊轉化為具體的投資決策建議。
2. 機器學習與資料科學：熟悉 PCA、PLS、決策樹、圖神經網路 (GNN) 等演算法，擅長處理高維度財務數據的降維與資產報酬預測，並具備處理資料不平衡問題的實務經驗。
3. 前瞻技術與 Web3：熱衷於探索金融科技的前沿應用，包含 AI Agent 架構設計以及 Web3 與去中心化金融 (DeFi) 的鏈上理財與智能合約應用整合。

【精選專案】
- 等權重 ETF 投資組合建構與回測系統
- 機器學習與財務計量預測模型開發
- 台指選擇權模擬交易與策略開發
- AI Agent 結合 Web3 與 DeFi 理財架構

【聯絡方式】
- Email: 112302043@g.nccu.edu.tw
- 目前歡迎各種合作機會。

請根據上述資訊來回答訪客的問題。如果訪客問了上述沒有的資訊，請禮貌地請他們直接透過 Email 聯絡 吳佩馨。`;

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    chatInput.value = '';

    const loadingDiv = appendLoading();

    if (GEMINI_API_KEY === "請替換為您的_GEMINI_API_KEY") {
        chatMessages.removeChild(loadingDiv);
        appendMessage('⚠️ 系統提示：您尚未設定 GEMINI_API_KEY，請在 script.js 中設定。', 'ai');
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: PERSONAL_INFO }]
                },
                contents: [{
                    parts: [{ text: message }]
                }],
                generationConfig: {
                    temperature: 0.7
                }
            })
        });
        
        const data = await response.json();
        chatMessages.removeChild(loadingDiv);
        
        if (response.ok && data.candidates && data.candidates.length > 0) {
            const replyText = data.candidates[0].content.parts[0].text;
            appendMessage(replyText, 'ai');
        } else {
            console.error('API Error:', data);
            appendMessage('抱歉，發生了錯誤：' + (data.error?.message || '無法連接到伺服器。'), 'ai');
        }
    } catch (error) {
        console.error('Fetch Error:', error);
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
