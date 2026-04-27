# Shannon Wu's Personal Portfolio Website

這是一個為 Shannon Wu 量身打造的個人網頁，結合了金融數據分析專業與生活美學。

## 網站特色 🌟
- **鹿系與抹茶質感設計**：使用日系、韓系高雅的色調（Matcha & Soft Living Aesthetic）。
- **動態捲動效果**：平滑的捲動動畫與導覽列模糊效果（Glassmorphism）。
- **響應式設計**：完美適配電腦與手機裝置的瀏覽體驗。

## 專案結構 📂
- `index.html` - 網站主架構，整合了您的履歷及四大特質（專業者、生活美學家、二次元探索者、公民實踐者）。
- `styles.css` - 視覺設計與排版。
- `script.js` - 動畫與互動邏輯。
- `.pre-commit-config.yaml` - 程式碼自動格式化設定 (Pre-commit hooks)。

## 開發指南與 Pre-commit 🚀

如果您想針對專案進行開發並使用 pre-commit 來維持程式碼排版風格：

1. 安裝 pre-commit：
   如果您剛才已經設定好了 `uv venv` 虛擬環境，請啟動環境並安裝 `pre-commit`：
   ```bash
   .venv\Scripts\activate
   uv pip install pre-commit
   ```

2. 啟用 pre-commit：
   ```bash
   pre-commit install
   ```

## 如何預覽網頁 🌐
這個網頁可以直接在瀏覽器中雙擊 `index.html` 開啟進行瀏覽。
如果您想用伺服器的模式開啟，可以使用 Python 內建的指令：
```bash
python -m http.server 8000
```
然後在瀏覽器中前往 `http://localhost:8000` 即可預覽。
