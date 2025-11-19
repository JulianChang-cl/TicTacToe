# TicTacToe

簡潔版快速說明（繁體中文）

---

簡單的原生 JavaScript 井字遊戲（Tic-Tac-Toe），支援人機對戰（AI）、三種難度與基本 UI。此專案提供開發環境（Webpack + dev server）與 Jest 測試。

**目標**
- 單機與 AI 對戰
- 易於閱讀與擴充的原生 JS 實作

---

## 快速開始

安裝依賴：

```powershell
cd d:\PlayGround\TicTacToe
npm install
```

啟動開發伺服器：

```powershell
npm start
```

執行測試：

```powershell
npm test
```

---

## 常用命令

- `npm start` - 啟動開發伺服器
- `npm run build` - 建置生產檔案
- `npm test` - 執行 Jest 測試
- `npm run lint` - 執行 ESLint（如有）

---

## 專案結構（重點）

- `src/scripts/` - 遊戲邏輯與 UI
- `tests/` 或 `tests/unit/` - 單元測試
- `package.json`, `webpack.config.js`, `jest.config.js`

---

## 常見問題

### Q: 遊戲怎樣開始？

**A**: 打開 `index.html` 或訪問應用 URL。頁面加載後，棋盤和難度選擇器立即可見。選擇難度（默認"中等"），然後點擊棋盤上的任意空位開始遊戲。

### Q: AI 為什麼要花2秒才著法？

**A**: 這是設計特性。AI 在 50-100ms 內計算著法，但額外延遲 (500ms-2秒) 是為了：
1. 模擬人類思考時間，讓遊戲體驗更自然
2. 避免顯得 AI 反應太快而不合理

### Q: 我可以保存遊戲進度嗎？

**A**: 目前不支持遊戲進度持久化。刷新頁面後，遊戲重置。若要添加此功能，可使用 LocalStorage API。

### Q: 為什麼困難模式下很難贏？

**A**: 因為困難模式使用 Minimax 算法的最優演奏。在井字遊戲中，如果 AI 使用最優演奏，玩家最佳結果是平局。若玩家犯錯，AI 會立即懲罰並贏得遊戲。

### Q: 我可以在手機上玩嗎？

**A**: 可以。應用在手機瀏覽器上可使用，但未針對手機優化。觸摸響應可能不如桌面順暢。

### Q: 代碼由誰維護？

**A**: 本應用由 TicTacToe 專案團隊維護。所有變更應通過規格 (spec.md) 與設計文件 (data-model.md) 記錄。

### Q: 我在運行測試時遇到錯誤。怎樣解決？

**A**: 
1. 確認 Node.js 版本 ≥ 18: `node --version`
2. 重新安裝依賴: `rm -rf node_modules && npm install`
3. 檢查是否有環境變數衝突 (如舊版 npm)
4. 查看 Jest 輸出中的詳細錯誤訊息

### Q: 如何在無網際網路的情況下遊玩？

**A**: 應用完全離線運行。下載所有檔案後，在本地用 HTTP 伺服器打開 (見[本地運行](#本地運行)部分)，無需網際網路連接。

---

## 後續步驟

### 對於玩家

- 享受遊戲！試試所有難度級別
- 在簡單模式下練習基本策略
- 挑戰困難模式

### 對於開發者

- 閱讀 `spec.md` 理解功能需求
- 查看 `data-model.md` 理解技術設計
- 查看 `contracts/README.md` 理解 API
- 運行 `npm start` 開始開發
- 提交變更前運行 `npm test && npm run lint`

### 相關文件

| 文件 | 用途 |
|------|------|
| [spec.md](spec.md) | 功能規格與需求 |
| [plan.md](plan.md) | 實裝計劃與架構 |
| [research.md](research.md) | 技術研究與決策 |
| [data-model.md](data-model.md) | 資料模型與實體 |
| [contracts/README.md](contracts/README.md) | API 契約 |

---

**祝您遊戲愉快！🎮**
