import os
from flask import Flask, request, jsonify, send_from_directory
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='/')

# Configure Gemini API using the new google-genai package
API_KEY = os.environ.get("GEMINI_API_KEY")
if API_KEY:
    client = genai.Client(api_key=API_KEY)
else:
    client = None

# 個人資訊，做為 System Prompt 提供給 AI
PERSONAL_INFO = """
你現在是 吳佩馨 的專屬 AI 助理，負責在她的個人網站上回答訪客的問題。你的語氣要專業、友善，並且能清楚介紹她的資訊。
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

請根據上述資訊來回答訪客的問題。如果訪客問了上述沒有的資訊，請禮貌地請他們直接透過 Email 聯絡 吳佩馨。
"""

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({"error": "伺服器尚未設定 Gemini API 金鑰 (GEMINI_API_KEY)。"}), 500
    
    data = request.json
    user_message = data.get("message")
    
    if not user_message:
        return jsonify({"error": "請提供訊息。"}), 400
        
    try:
        response = client.models.generate_content(
            model='gemini-3.1-flash-lite-preview',
            contents=user_message,
            config=types.GenerateContentConfig(
                system_instruction=PERSONAL_INFO,
                temperature=0.7,
            )
        )
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
