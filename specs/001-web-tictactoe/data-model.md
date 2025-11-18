# 資料模型：網頁版井字遊戲

**Phase**: 1 - 設計 & 契約  
**Date**: 2025-11-12  
**Status**: 完成  
**Input**: Feature Specification + Research Document (Phase 0)

## 模型概述

本資料模型定義井字遊戲的核心實體、屬性、驗證規則與狀態轉換。

---

## 核心實體

### 實體 1: GameBoard (遊戲棋盤)

**目的**: 代表3x3棋盤的當前狀態

**屬性**:
| 屬性 | 類型 | 約束 | 說明 |
|------|------|------|------|
| `cells` | Array<number> | 長度=9, 每元素 ∈ {0, 1, -1} | 棋盤的9個位置；0=空, 1=玩家(X), -1=AI(O) |
| `positions` | Object | keys: 'top-left', 'top-center', ..., 'bottom-right' | 位置索引對應 (可選，用於UI) |

**驗證規則**:
- `cells` 必須包含正好9個元素
- 元素值僅能為 0 (空), 1 (X), -1 (O)
- 玩家棋子數 (1的計數) 必須 ≤ AI棋子數 + 1 (因玩家先手)

**方法**:
```typescript
class GameBoard {
  constructor()
  getCell(index: number): number  // 取得位置i的值
  setCell(index: number, value: number): void  // 放置棋子
  isEmpty(): boolean  // 棋盤是否還有空位
  canMove(index: number): boolean  // 位置是否可著法
  reset(): void  // 重置棋盤
}
```

**狀態示例**:
```
初始:  [0, 0, 0, 0, 0, 0, 0, 0, 0]
玩家著法(索引4): [0, 0, 0, 0, 1, 0, 0, 0, 0]
AI著法(索引0): [-1, 0, 0, 0, 1, 0, 0, 0, 0]
```

---

### 實體 2: GameState (遊戲狀態)

**目的**: 管理遊戲邏輯狀態、輪次、結果

**屬性**:
| 屬性 | 類型 | 約束 | 說明 |
|------|------|------|------|
| `board` | GameBoard | 關聯實體 | 當前棋盤狀態 |
| `currentTurn` | string | ∈ {'player', 'ai'} | 當前輪次 |
| `isGameOver` | boolean | - | 遊戲是否結束 |
| `winner` | string \| null | ∈ {'player', 'ai', 'draw', null} | 勝者或平局 |
| `difficulty` | string | ∈ {'easy', 'medium', 'hard'} | 當前難度 |
| `lastMoveIndex` | number \| null | 0-8 或 null | 最後著法的位置 |
| `moveCount` | number | 0-9 | 已進行的著法數 |

**驗證規則**:
- `isGameOver` = true ⟺ `winner` ≠ null
- `currentTurn` = 'player' 當且僅當 `moveCount` 為偶數 (玩家先手)
- 遊戲未開始時，`winner` = null, `isGameOver` = false

**方法**:
```typescript
class GameState {
  constructor(difficulty: string = 'medium')
  makePlayerMove(index: number): boolean  // 玩家著法，返回成功
  makeAIMove(): void  // AI著法 (內部調用AIEngine)
  checkWinner(): string | null  // 檢查是否有勝者
  checkDraw(): boolean  // 檢查是否平局
  reset(): void  // 重置遊戲
  setDifficulty(level: string): void  // 更改難度
  isValidMove(index: number): boolean  // 驗證著法有效性
}
```

**狀態轉換圖**:
```
[遊戲未開始]
    ↓ (玩家著法)
[玩家輪次]
    ↓ (AI著法)
[AI輪次]
    ↓ (檢查遊戲結束?)
├─ YES → [遊戲結束 - 顯示結果]
└─ NO  → 回到 [玩家輪次]

[遊戲結束]
    ↓ (點擊"重新開始")
[遊戲未開始]
```

---

### 實體 3: AIEngine (AI引擎)

**目的**: 計算AI著法策略

**屬性**:
| 屬性 | 類型 | 說明 |
|------|------|------|
| `difficulty` | string | 難度等級 |
| `board` | GameBoard | 當前棋盤狀態 (引用) |

**演算法**:
- 使用 **Minimax 算法** 評估所有可能的著法
- 著法優先級: (1) 防守, (2) 攻擊, (3) 策略著法
- 難度影響優先級嚴格度：

| 難度 | 防守優先 | 攻擊優先 | 隨機性 |
|------|---------|---------|--------|
| Easy | 50% | 30% | 20% (隨機選) |
| Medium | 90% | 95% | 5% |
| Hard | 100% | 100% | 0% |

**方法**:
```typescript
class AIEngine {
  constructor(difficulty: string, board: GameBoard)
  calculateBestMove(): number  // 返回最佳著法位置 (0-8)
  evaluatePosition(board: GameBoard): number  // Minimax評估函數
  getDefensiveMove(): number  // 防守著法
  getOffensiveMove(): number  // 攻擊著法
}
```

**評估函數**:
```
評估(棋盤狀態):
  if 遊戲結束:
    if AI勝 return +10
    if 玩家勝 return -10
    if 平局 return 0
  
  result = 最小值 (-∞)
  for 每個空位:
    放置AI棋子
    結果 = -評估(新棋盤)  # 負號因為交替輪次
    撤回棋子
    result = max(result, 評估結果)
  return result
```

**時間複雜度**: O(9!) ≈ 362,880 最壞情況，但實際平均 O(1000-5000) 因為遊戲早期結束

---

### 實體 4: DifficultyLevel (難度等級)

**目的**: 管理難度參數與AI行為

**屬性**:
| 難度 | 防守% | 攻擊% | 隨機% | 說明 |
|------|------|------|-------|------|
| Easy | 50 | 30 | 20 | AI 經常犯錯，玩家容易勝 |
| Medium | 90 | 95 | 5 | AI 有競爭力，均衡遊戲 |
| Hard | 100 | 100 | 0 | AI 最優演奏，平局或勝 |

**方法**:
```typescript
class DifficultyLevel {
  static validate(level: string): boolean
  static getConfig(level: string): Object
}
```

---

### 實體 5: UIState (UI狀態)

**目的**: 管理UI相關狀態（獨立於遊戲邏輯）

**屬性**:
| 屬性 | 類型 | 說明 |
|------|------|------|
| `isDifficultyMenuOpen` | boolean | 難度選擇菜單是否顯示 |
| `isAIThinking` | boolean | AI正在計算著法 |
| `lastClickedIndex` | number \| null | 最後點擊的棋盤位置 |
| `animationInProgress` | boolean | 動畫是否進行中 |

**方法**:
```typescript
class UIState {
  toggleDifficultyMenu(): void
  setAIThinking(thinking: boolean): void
  setAnimationInProgress(inProgress: boolean): void
}
```

---

### 實體 6: GameSession (遊戲會話)

**目的**: 組合所有狀態，提供統一入口

**屬性**:
| 屬性 | 類型 | 說明 |
|------|------|------|
| `gameState` | GameState | 遊戲邏輯狀態 |
| `uiState` | UIState | UI狀態 |
| `aiEngine` | AIEngine | AI引擎 |

**方法**:
```typescript
class GameSession {
  constructor(difficulty: string = 'medium')
  playerMove(index: number): boolean
  aiMove(): Promise<void>  // 非同步，模擬思考時間
  reset(): void
  setDifficulty(level: string): void
  getState(): Object  // 返回完整狀態快照
}
```

---

## 資料完整性與驗證

### 驗證規則表

| 實體 | 驗證規則 | 觸發時機 | 錯誤處理 |
|------|---------|---------|---------|
| GameBoard | 9個元素, 值 ∈ {0,1,-1} | setCell() | throw Error |
| GameBoard | 玩家數 ≤ AI數+1 | 檢查勝負 | 內部檢測，不應發生 |
| GameState | isGameOver ⟺ winner ≠ null | 狀態變更 | 自動保持同步 |
| GameState | currentTurn 與 moveCount 一致 | 著法後 | 自動維護 |
| AIEngine | 難度有效值 | 建構 | throw Error |
| DifficultyLevel | 難度 ∈ {easy, medium, hard} | setDifficulty() | throw Error |

---

## 狀態初始化

**遊戲開始**:
```javascript
const session = new GameSession('medium');
// GameBoard: [0,0,0,0,0,0,0,0,0]
// GameState.currentTurn: 'player'
// GameState.isGameOver: false
// GameState.winner: null
```

**玩家著法**:
```javascript
session.playerMove(4);  // 中心位置
// GameBoard: [0,0,0,0,1,0,0,0,0]
// GameState.currentTurn: 'ai'
```

**AI著法**:
```javascript
await session.aiMove();
// GameBoard: [-1,0,0,0,1,0,0,0,0]
// GameState.currentTurn: 'player'
```

---

## 資料流圖

```
玩家點擊 棋盤位置
    ↓
UIController.handleBoardClick(index)
    ↓
GameSession.playerMove(index)
    ├─ 驗證著法有效性
    ├─ GameBoard.setCell(index, 1)
    ├─ 檢查是否勝利/平局
    └─ 設置 currentTurn = 'ai'
    ↓
UIController.updateBoardDisplay()  (同步UI)
    ↓
GameSession.aiMove()  (非同步)
    ├─ AIEngine.calculateBestMove()
    ├─ GameBoard.setCell(bestIndex, -1)
    ├─ 檢查是否勝利/平局
    └─ 設置 currentTurn = 'player'
    ↓
UIController.updateBoardDisplay()  (同步UI)
    ↓
檢查 GameState.isGameOver?
    ├─ YES: UIController.showResult()
    └─ NO: 等待下一次玩家著法
```

---

## Phase 1 資料模型完成檢查清單

- [x] GameBoard 實體與邏輯 ✅
- [x] GameState 狀態機與轉換 ✅
- [x] AIEngine 算法設計 ✅
- [x] DifficultyLevel 參數 ✅
- [x] UIState 管理 ✅
- [x] GameSession 組合 ✅
- [x] 驗證規則定義 ✅
- [x] 資料流設計 ✅

**Phase 1 資料模型 Status**: ✅ **完成**

---

**下一步**: 生成 contracts/ 與 quickstart.md
