# 任務清單：網頁版井字遊戲

**Input**: Design documents from `specs/001-web-tictactoe/`  
**Branch**: `001-web-tictactoe`  
**Date Generated**: 2025-11-12  
**Status**: Ready for Implementation

---

## 格式說明：`[ID] [P?] [Story?] 描述 with file path`

- **[P]**: 可並行執行 (不同檔案、無依賴)
- **[Story]**: 屬於哪個使用者故事 (例如 [US1], [US2], [US3])
- **包含確切的檔案路徑**

---

## Phase 1: 專案設置 (共享基礎設施)

**目的**: 專案初始化與基本結構

- [x] T001 根據實裝計劃創建專案結構 (src/, tests/, dist/)
- [x] T002 初始化 Node.js 專案，配置 package.json (npm, webpack/vite, jest, eslint)
- [x] T003 [P] 配置 ESLint 與 Prettier (在 src/scripts/*.js 上)
- [x] T004 [P] 配置 Jest 測試框架 (jest.config.js)
- [x] T005 [P] 配置 Webpack 開發伺服器或 Vite (webpack.config.js 或 vite.config.js)
- [x] T006 創建基本 HTML 入口點 (src/index.html) 含棋盤容器、難度選擇器、結果顯示

---

## Phase 2: 基礎 (阻擋前置條件)

**目的**: 所有使用者故事依賴的核心基礎設施

**⚠️ 關鍵**: 此 Phase 完成前，任何使用者故事都無法開始

- [x] T007 [P] 實裝 GameBoard 基礎類別 (src/scripts/game-board.js) 含方法簽名（getCell, setCell, isEmpty, canMove, reset, getEmptyCells）
- [x] T008 [P] 實裝 GameState 基礎類別 (src/scripts/game-state.js) 含方法簽名與狀態追蹤
- [x] T009 [P] 實裝 DifficultyLevel 類別 (src/scripts/difficulty.js) 含 Easy/Medium/Hard 定義
- [x] T010 [P] 實裝 AIEngine 基礎類別 (src/scripts/ai-engine.js) 含方法簽名與 Minimax 框架
- [x] T011 [P] 實裝 UIController 基礎類別 (src/scripts/ui-controller.js) 含 DOM 綁定與事件監聽框架
- [x] T012 [P] 創建基本 CSS 樣式 (src/styles/game.css) 含棋盤版面、難度按鈕、結果顯示樣式
- [x] T013 設置 main.js 應用入口點 (src/scripts/main.js) 初始化所有元件

**檢查點**: 基礎完成 - 可開始實裝使用者故事

---

## Phase 3: 使用者故事 1 - 快速進入遊戲 (優先級: P1) 🎯 MVP

**目標**: 玩家打開應用後立即看到遊戲棋盤，無需設置，3秒內可玩

**獨立測試**: 在瀏覽器中打開 index.html，驗證棋盤立即顯示、可互動，玩家可點擊並放置棋子

### 實裝任務 (使用者故事 1)

- [x] T014 [P] [US1] 實裝 GameBoard.getCell() 方法 (src/scripts/game-board.js) - 取得位置值
- [x] T015 [P] [US1] 實裝 GameBoard.setCell() 方法 (src/scripts/game-board.js) - 放置棋子與驗證
- [x] T016 [P] [US1] 實裝 GameBoard.canMove() 方法 (src/scripts/game-board.js) - 驗證位置可著
- [x] T017 [US1] 實裝 UIController.init() 方法 (src/scripts/ui-controller.js) - 初始化棋盤 DOM 與事件監聽
- [x] T018 [US1] 實裝 UIController.updateBoardDisplay() 方法 (src/scripts/ui-controller.js) - 同步棋盤視覺
- [x] T019 [US1] 實裝 UIController.handleBoardClick() 方法 (src/scripts/ui-controller.js) - 處理玩家點擊棋盤位置
- [x] T020 [US1] 實裝 GameState.makePlayerMove() 方法 (src/scripts/game-state.js) - 玩家著法邏輯
- [x] T021 [US1] 實裝玩家著法反饋 (src/styles/game.css) - 視覺回饋 (< 300ms)
- [ ] T022 [US1] 建立使用者故事 1 的單位測試 (tests/unit/game-board.test.js) - 棋盤操作測試
- [ ] T023 [US1] 建立玩家著法集成測試 (tests/integration/player-move.test.js) - 著法與視覺同步

**檢查點**: 使用者故事 1 應能獨立運作 - 玩家可開啟、看到棋盤、放置棋子

---

## Phase 4: 使用者故事 2 - 與 AI 對戰 (優先級: P1)

**目標**: 玩家與智能 AI 對手對戰，AI 迅速做出合理著法，遊戲邏輯正確

**獨立測試**: 完整進行一局遊戲 (多個來回)，驗證 AI 著法有效、勝敗判定正確、遊戲流程流暢

### 實裝任務 (使用者故事 2)

- [x] T024 [P] [US2] 實裝 AIEngine.evaluatePosition() 方法 (src/scripts/ai-engine.js) - Minimax 評估函數
- [x] T025 [P] [US2] 實裝 AIEngine.getDefensiveMove() 方法 (src/scripts/ai-engine.js) - 防守策略 (阻止玩家勝利)
- [x] T026 [P] [US2] 實裝 AIEngine.getOffensiveMove() 方法 (src/scripts/ai-engine.js) - 攻擊策略 (自身勝利)
- [x] T027 [US2] 實裝 AIEngine.calculateBestMove() 方法 (src/scripts/ai-engine.js) - 綜合優先級決策 (防守→攻擊→策略)
- [x] T028 [US2] 實裝 GameState.makeAIMove() 方法 (src/scripts/game-state.js) - AI 著法執行
- [x] T029 [US2] 實裝 GameState.checkWinner() 方法 (src/scripts/game-state.js) - 勝利判定 (行、列、對角線)
- [x] T030 [US2] 實裝 GameState.checkDraw() 方法 (src/scripts/game-state.js) - 平局判定
- [x] T031 [US2] 實裝遊戲結束邏輯 (src/scripts/game-state.js) - 更新 isGameOver、winner
- [x] T032 [US2] 實裝 UIController.showResult() 方法 (src/scripts/ui-controller.js) - 顯示勝負結果
- [x] T033 [US2] 實裝 AI 思考延遲與視覺回饋 (src/scripts/ui-controller.js + src/styles/game.css) - 500ms-2秒延遲模擬思考
- [x] T034 [P] [US2] 實裝著法禁用機制 (src/scripts/ui-controller.js) - AI 著法時禁止玩家操作
- [ ] T035 [US2] 建立 Minimax 演算法單位測試 (tests/unit/ai-engine.test.js) - AI 著法邏輯驗證
- [ ] T036 [US2] 建立勝敗判定單位測試 (tests/unit/game-state.test.js) - 所有勝利條件與平局
- [ ] T037 [US2] 建立完整遊戲流程集成測試 (tests/integration/game-flow.test.js) - 玩家→AI→判定→結果流程

**檢查點**: 使用者故事 1 + 2 應能獨立運作 - 完整遊戲可玩，AI 著法合理，勝敗判定正確

---

## Phase 5: 使用者故事 3 - 難度選擇 (優先級: P2)

**目標**: 玩家可選擇難度 (簡單/中等/困難)，不同難度影響 AI 策略強度

**獨立測試**: 在不同難度下進行多局遊戲，驗證 AI 行為差異 (簡單模式易被打敗 ≥80%、困難模式難以勝利)

### 實裝任務 (使用者故事 3)

- [ ] T038 [P] [US3] 實裝 DifficultyLevel.getStrategy() 方法 (src/scripts/difficulty.js) - 取得難度參數 (防守%、攻擊%、隨機%)
- [ ] T039 [P] [US3] 實裝 Easy 難度策略 (50% 防守, 30% 攻擊, 20% 隨機) (src/scripts/ai-engine.js)
- [ ] T040 [P] [US3] 實裝 Medium 難度策略 (90% 防守, 95% 攻擊, 5% 隨機) (src/scripts/ai-engine.js)
- [ ] T041 [P] [US3] 實裝 Hard 難度策略 (100% 防守, 100% 攻擊, 0% 隨機) (src/scripts/ai-engine.js)
- [ ] T042 [US3] 實裝 GameState.setDifficulty() 方法 (src/scripts/game-state.js) - 變更難度
- [ ] T043 [US3] 實裝 UIController.showDifficultyMenu() 方法 (src/scripts/ui-controller.js) - 顯示難度選擇器 (Simple/Medium/Hard)
- [ ] T044 [US3] 實裝難度選擇器 DOM 與事件監聽 (src/index.html + src/scripts/ui-controller.js) - 頁面加載時同時顯示難度菜單與棋盤
- [ ] T045 [US3] 實裝難度選擇器樣式 (src/styles/game.css) - 難度按鈕視覺設計與狀態 (未選/已選)
- [ ] T046 [US3] 實裝難度持久化 (可選) (src/scripts/difficulty.js + localStorage) - 記憶玩家最後選擇的難度 (非強制，可選)
- [ ] T047 [US3] 實裝「重新開始」保留難度 (src/scripts/ui-controller.js) - 點擊「重新開始」按鈕時保持當前難度
- [ ] T048 [US3] 實裝遊戲中難度變更 (src/scripts/ui-controller.js) - 允許玩家隨時更改難度，自動重新開始新遊戲
- [ ] T049 [P] [US3] 建立難度邏輯單位測試 (tests/unit/difficulty.test.js) - 驗證各難度參數與策略
- [ ] T050 [US3] 建立難度 AI 行為集成測試 (tests/integration/difficulty-behavior.test.js) - 驗證各難度下 AI 的實際行為差異

**檢查點**: 使用者故事 1 + 2 + 3 應完全運作 - 可選難度、玩完整遊戲、AI 難度影響明顯

---

## Phase 6: 邊界情況與錯誤處理

**目的**: 處理邊界情況與增強健壯性

- [ ] T051 [P] 實裝重複著法拒絕 (src/scripts/game-board.js + ui-controller.js) - 玩家點擊已佔據位置時拒絕
- [ ] T052 [P] 實裝無效著法驗證 (src/scripts/game-state.js) - isValidMove() 方法
- [ ] T053 [P] 實裝輸入邊界檢查 (src/scripts/game-board.js) - 索引範圍驗證 (0-8)
- [ ] T054 實裝棋盤滿平局判定 (src/scripts/game-state.js) - 所有位置填滿但無勝者 = 平局
- [ ] T055 實裝遊戲結束禁止操作 (src/scripts/ui-controller.js) - 結果顯示後棋盤禁用，需點擊「重新開始」
- [ ] T056 [P] 建立邊界情況單位測試 (tests/unit/boundary.test.js) - 無效著法、重複著法、棋盤滿

**檢查點**: 應用能優雅地處理邊界情況，無異常行為

---

## Phase 7: 瀏覽器相容性與效能

**目的**: 確保跨瀏覽器支持與效能達標

- [ ] T057 [P] 配置 Babel 轉譯 ES6+ (webpack.config.js) - 支持舊版瀏覽器
- [ ] T058 [P] 配置 Autoprefixer CSS (webpack.config.js) - 自動加 vendor prefix
- [ ] T059 設定效能基準測試 (tests/performance.test.js) - P50 ≤ 200ms, P95 ≤ 1000ms, P99 ≤ 2000ms
- [ ] T060 [P] 手動測試 Chrome 最新版本 (驗證佈局、互動、AI著法)
- [ ] T061 [P] 手動測試 Firefox 最新版本 (驗證佈局、互動、AI著法)
- [ ] T062 [P] 手動測試 Safari 最新版本 (驗證佈局、互動、AI著法)
- [ ] T063 [P] 手動測試 Edge 最新版本 (驗證佈局、互動、AI著法)
- [ ] T064 驗證移動設備可用性 (iOS Safari, Android Chrome) - 無特殊優化，應基本可用
- [ ] T065 驗證離線運行 (斷網狀態) - 應用應完全離線運行，無網絡依賴

**檢查點**: 應用在所有主流桌面瀏覽器上正常運行，效能達標

---

## Phase 8: 測試覆蓋與品質確保

**目的**: 達到 ≥80% 測試覆蓋率，驗證代碼品質

- [ ] T066 統計單位測試覆蓋率 (npm test -- --coverage) - 目標 ≥80%
- [ ] T067 補充缺失的單位測試 (tests/unit/) - 若覆蓋率不足
- [ ] T068 [P] 建立 E2E 測試基本情景 (tests/e2e/game-scenarios.test.js) - 使用 Cypress/Playwright
  - 情景 1: 玩家勝利
  - 情景 2: AI 勝利
  - 情景 3: 平局
  - 情景 4: 難度變更與遊戲重啟
- [ ] T069 驗證代碼複雜度 (ESLint cyclomatic-complexity) - 目標 ≤10
- [ ] T070 檢查代碼風格一致性 (npm run lint) - 無 ESLint 警告或錯誤
- [ ] T071 執行全部測試 (npm test) - 確保所有測試通過

**檢查點**: 測試覆蓋率 ≥80%, 代碼品質符合憲法標準

---

## Phase 9: 文檔與交付

**目的**: 完成開發者文檔與應用交付

- [ ] T072 [P] 驗證 quickstart.md 中的設置步驟 (npm install, npm start, npm test)
- [ ] T073 [P] 驗證 quickstart.md 中的遊戲玩法說明 (棋盤佈局、著法規則、難度說明)
- [ ] T074 [P] 驗證 quickstart.md 中的常見問題章節
- [ ] T075 更新 README.md (如有) - 加入專案概述、功能簡介、快速開始連結
- [ ] T076 [P] 編寫開發者貢獻指南 (CONTRIBUTING.md) - 代碼風格、測試要求、提交流程
- [ ] T077 驗證生產構建 (npm run build) - dist/ 包含最小化的 HTML/CSS/JS
- [ ] T078 驗證生產構建檔案大小 - 總大小 ≤ 500KB (建議 ≤ 50KB)
- [ ] T079 測試生產構建運行 (在真實伺服器或靜態檔案伺服器上)

**檢查點**: 應用已完全文檔化，可交付生產

---

## Phase 10: 最終驗證與優化

**目的**: 交叉功能關注與應用優化

- [ ] T080 [P] 驗證無障礙設計 (WCAG AA) - 鍵盤導航、螢幕閱讀器相容性 (選項)
- [ ] T081 [P] 優化 AI 著法性能 - 若 AI 計算 > 100ms，考慮剪枝或緩存
- [ ] T082 [P] 優化 DOM 渲染性能 - 若棋盤更新 > 50ms，考慮批量更新
- [ ] T083 [P] 代碼清理與重構 - 移除除錯程式碼、優化邏輯、提升可讀性
- [ ] T084 [P] 驗證記憶體洩漏 (DevTools) - 長時間運行應無記憶體洩漏
- [ ] T085 驗證專案憲法對齐 (四個原則) - 程式碼品質✅、測試標準✅、UX一致性✅、效能✅
- [ ] T086 執行最終完整遊戲測試 - 10+ 局遊戲，所有難度，各瀏覽器
- [ ] T087 生成最終報告 - 項目統計、測試覆蓋率、效能指標、已知問題

**檢查點**: 應用已完全測試、優化、驗證

---

## 依賴與執行順序

### Phase 依賴

- **Phase 1 (設置)**: 無依賴 - 立即開始
- **Phase 2 (基礎)**: 依賴 Phase 1 - **阻擋所有使用者故事**
- **Phase 3-5 (使用者故事)**: 依賴 Phase 2 - 可並行執行 (若有人力)
- **Phase 6-10 (邊界、相容、測試、文檔、優化)**: 依賴使用者故事完成

### 使用者故事依賴

- **US1 (快速進入)**: Phase 2 後可開始 - 無其他故事依賴
- **US2 (AI 對戰)**: Phase 2 後可開始 - 可與 US1 並行，但集成需要 US1
- **US3 (難度選擇)**: Phase 2 後可開始 - 依賴 US1 + US2 的 AI 實裝

### 並行機會

- **Phase 1**: 所有 [P] 任務並行 (T003, T004, T005)
- **Phase 2**: 所有 [P] 任務並行 (T007-T012)
- **Phase 3**: 大多 [P] 任務並行 (T014-T016)
- **Phase 3-5**: 若有多個開發者，各故事可並行 (但需 Phase 2 完成)
- **Phase 7**: 瀏覽器測試全部並行 (T060-T064)
- **Phase 8**: 測試統計與檢查並行 (T066, T068, T069, T070)

---

## 並行實例：使用者故事 1

```bash
# 啟動 Phase 2 基礎任務 (並行):
T007: 實裝 GameBoard 類別
T008: 實裝 GameState 類別
T009: 實裝 DifficultyLevel 類別
T010: 實裝 AIEngine 類別
T011: 實裝 UIController 類別
T012: 創建基本 CSS

# Phase 2 完成後，啟動 US1 模型任務 (並行):
T014: GameBoard.getCell()
T015: GameBoard.setCell()
T016: GameBoard.canMove()

# 然後依序:
T017: UIController.init()
T018: UIController.updateBoardDisplay()
T019: UIController.handleBoardClick()
T020: GameState.makePlayerMove()
T021-T023: 樣式與測試
```

---

## 實裝策略

### MVP 優先 (僅使用者故事 1)

1. 完成 Phase 1: 設置
2. 完成 Phase 2: 基礎 **[關鍵]**
3. 完成 Phase 3: 使用者故事 1
4. **停止與驗證**: 測試使用者故事 1 獨立運作
5. 若準備好可部署/演示

### 增量交付

1. 完成設置 + 基礎 → 基礎準備好
2. 加入 US1 → 獨立測試 → 部署/演示 (MVP!)
3. 加入 US2 → 獨立測試 → 部署/演示
4. 加入 US3 → 獨立測試 → 部署/演示
5. 每個故事在不破壞之前故事的情況下增加價值

### 並行團隊策略

多開發者情況:

1. 團隊完成設置 + 基礎
2. 基礎完成後:
   - 開發者 A: 使用者故事 1
   - 開發者 B: 使用者故事 2
   - 開發者 C: 測試 & 優化
3. 故事並行完成並獨立整合

---

## 檢查點總結

| Phase | 檢查點 | 驗證方法 |
|-------|--------|---------|
| Phase 1 | 專案結構已創建 | `npm install` 成功，檔案結構符合 plan.md |
| Phase 2 | 基礎類別已實裝 | 類別存在、方法簽名符合契約、無語法錯誤 |
| Phase 3 | US1 獨立運作 | 開啟應用，棋盤可見，可點擊放置棋子 |
| Phase 4 | US1+US2 運作 | 完整遊戲可玩，AI 著法有效，勝敗判定正確 |
| Phase 5 | US1+US2+US3 運作 | 難度選擇有效，各難度 AI 行為差異明顯 |
| Phase 6 | 邊界情況處理 | 拒絕無效著法，正確判定平局，遊戲結束禁用 |
| Phase 7 | 跨瀏覽器運作 | Chrome/Firefox/Safari/Edge 都正常運行，效能達標 |
| Phase 8 | 測試充分 | 測試覆蓋率 ≥80%, 所有測試通過 |
| Phase 9 | 文檔完整 | README、quickstart、開發指南已更新 |
| Phase 10 | 最終驗證 | 10+ 局遊戲通過，憲法原則✅, 生產構建完成 |

---

## 注意事項

- [P] 任務 = 不同檔案、無依賴
- [Story] 標籤 = 映射到特定使用者故事以便追蹤
- 每個使用者故事應獨立完成與測試
- 驗證測試失敗後再實裝 (TDD)
- 每個任務或邏輯組後提交
- 可在任何檢查點停止驗證故事獨立運作
- 避免: 模糊任務、相同檔案衝突、破壞獨立性的跨故事依賴

---

## 相關檔案

| 檔案 | 用途 |
|------|------|
| `spec.md` | 功能規格與使用者故事 |
| `plan.md` | 實裝計劃與技術背景 |
| `research.md` | 技術研究與決策 |
| `data-model.md` | 資料模型與實體 |
| `contracts/README.md` | API 契約與方法簽名 |
| `quickstart.md` | 開發者快速開始指南 |

---

## 總計統計

| 指標 | 數值 |
|------|------|
| **總任務數** | 87 |
| **Phase 1 (設置)** | 6 個任務 |
| **Phase 2 (基礎)** | 7 個任務 |
| **Phase 3 (US1)** | 10 個任務 |
| **Phase 4 (US2)** | 14 個任務 |
| **Phase 5 (US3)** | 13 個任務 |
| **Phase 6 (邊界)** | 6 個任務 |
| **Phase 7 (相容)** | 9 個任務 |
| **Phase 8 (測試)** | 6 個任務 |
| **Phase 9 (文檔)** | 8 個任務 |
| **Phase 10 (優化)** | 8 個任務 |
| **並行機會** | ~45 個任務可並行 (~52%) |
| **MVP 範圍 (US1)** | ~16 個任務 (Phase 1 + 2 + 3) |

---

## 推薦實裝路線

### 第一週: 基礎 (12 個任務)
- Phase 1: 設置 (6 個任務)
- Phase 2: 基礎類別與樣式 (7 個任務)
- **里程碑**: 基礎準備完成，可開始使用者故事

### 第二週: 快速進入 & AI 對戰 (24 個任務)
- Phase 3: US1 實裝 + 測試 (10 個任務)
- Phase 4: US2 實裝 + 測試 (14 個任務)
- **里程碑**: 完整遊戲可玩

### 第三週: 難度 & 邊界 (19 個任務)
- Phase 5: US3 實裝 + 測試 (13 個任務)
- Phase 6: 邊界情況 (6 個任務)
- **里程碑**: 所有核心功能完成

### 第四週: 品質 & 交付 (22 個任務)
- Phase 7: 瀏覽器相容 (9 個任務)
- Phase 8: 測試覆蓋 (6 個任務)
- Phase 9: 文檔 (8 個任務)
- Phase 10: 優化與驗證 (8 個任務)
- **里程碑**: 應用已完全測試、優化、交付準備完成

**預計總工作量**: 4 週 (1 名開發者順序執行) 或 1-2 週 (2-3 名開發者並行)

---

**✅ Phase 1 專案設置已準備就緒。開始 T001。**
