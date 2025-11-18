# API 契約：網頁版井字遊戲

**Phase**: 1 - 契約設計  
**Date**: 2025-11-12  
**Format**: JavaScript 物件與方法簽名

---

## 概述

本契約定義遊戲應用的核心API，包括：
- GameBoard 棋盤操作
- GameState 狀態管理
- AIEngine AI計算
- UIController 用戶界面控制

所有API均在客戶端執行，無遠程調用。

---

## GameBoard API

### 建構子

```javascript
/**
 * 創建遊戲棋盤
 * @returns {GameBoard} 初始化的棋盤，所有位置為空
 */
const board = new GameBoard();
```

### 方法

#### getCell

```javascript
/**
 * 獲取指定位置的棋子
 * @param {number} index - 位置索引 (0-8)
 * @returns {number} 0=空, 1=玩家(X), -1=AI(O)
 * @throws {Error} 如果索引無效 (< 0 或 > 8)
 */
const value = board.getCell(4);  // 中心位置
// Returns: 0, 1, or -1
```

#### setCell

```javascript
/**
 * 在指定位置放置棋子
 * @param {number} index - 位置索引 (0-8)
 * @param {number} value - 棋子值 (0=空, 1=玩家, -1=AI)
 * @throws {Error} 如果位置已佔據或索引無效
 * @throws {Error} 如果值無效
 */
board.setCell(4, 1);  // 玩家在中心放置X
// Throws Error if board.getCell(4) !== 0
```

#### isEmpty

```javascript
/**
 * 檢查棋盤是否有空位可著
 * @returns {boolean} true=有空位, false=棋盤滿
 */
const hasSpace = board.isEmpty();
```

#### canMove

```javascript
/**
 * 驗證指定位置是否可著法
 * @param {number} index - 位置索引 (0-8)
 * @returns {boolean} true=可著, false=已佔據或無效
 */
if (board.canMove(4)) {
  board.setCell(4, 1);
}
```

#### reset

```javascript
/**
 * 重置棋盤為初始狀態
 * @returns {void}
 */
board.reset();  // 所有位置變為空
```

#### getEmptyCells

```javascript
/**
 * 獲取所有空位的索引
 * @returns {Array<number>} 空位索引列表 (0-8)
 */
const empty = board.getEmptyCells();
// Returns: [0, 1, 2, 3, 5, 6, 7, 8]
```

---

## GameState API

### 建構子

```javascript
/**
 * 創建遊戲狀態管理器
 * @param {string} difficulty - 難度等級 (默認 'medium')
 * @returns {GameState} 遊戲狀態物件
 * @throws {Error} 如果難度無效
 */
const gameState = new GameState('medium');
```

### 屬性 (唯讀)

```javascript
gameState.board;          // GameBoard 實例
gameState.currentTurn;    // 'player' 或 'ai'
gameState.isGameOver;     // boolean
gameState.winner;         // 'player', 'ai', 'draw', 或 null
gameState.difficulty;     // 'easy', 'medium', 'hard'
gameState.moveCount;      // 已進行著法數 (0-9)
gameState.lastMoveIndex;  // 最後著法位置或 null
```

### 方法

#### makePlayerMove

```javascript
/**
 * 玩家著法
 * @param {number} index - 位置索引 (0-8)
 * @returns {boolean} true=著法成功, false=著法無效
 * @throws {Error} 若當前不是玩家輪次
 */
const success = gameState.makePlayerMove(4);
if (success) {
  // 著法已記錄，AI將輪到
} else {
  // 位置已佔據或其他錯誤
}
```

#### makeAIMove

```javascript
/**
 * AI著法 (需同步調用或包裝在 async/await 中)
 * @returns {void}
 * @throws {Error} 若遊戲已結束或非AI輪次
 * 
 * 注: 內部自動設置 currentTurn = 'player'
 */
gameState.makeAIMove();
// AI已計算並執行著法
```

#### checkWinner

```javascript
/**
 * 檢查是否有勝者
 * @returns {string|null} 'player', 'ai', 或 null (遊戲繼續)
 */
const winner = gameState.checkWinner();
if (winner === 'player') {
  console.log('玩家勝利！');
}
```

#### checkDraw

```javascript
/**
 * 檢查是否平局 (棋盤滿且無勝者)
 * @returns {boolean} true=平局, false=遊戲繼續
 */
if (gameState.checkDraw()) {
  console.log('平局！');
}
```

#### isValidMove

```javascript
/**
 * 驗證著法有效性
 * @param {number} index - 位置索引 (0-8)
 * @returns {boolean} true=有效, false=無效
 */
if (gameState.isValidMove(4)) {
  gameState.makePlayerMove(4);
}
```

#### reset

```javascript
/**
 * 重置遊戲狀態 (保持難度不變)
 * @returns {void}
 */
gameState.reset();
// 棋盤清空，currentTurn='player', winner=null, moveCount=0
```

#### setDifficulty

```javascript
/**
 * 更改難度等級
 * @param {string} level - 'easy', 'medium', 或 'hard'
 * @returns {void}
 * @throws {Error} 若難度值無效
 * 
 * 注: 不自動重置遊戲，應在 reset() 後調用
 */
gameState.setDifficulty('hard');
gameState.reset();  // 用新難度開始新遊戲
```

---

## AIEngine API

### 建構子

```javascript
/**
 * 創建AI引擎
 * @param {string} difficulty - 難度等級
 * @param {GameBoard} board - 棋盤引用
 * @returns {AIEngine} AI引擎實例
 */
const aiEngine = new AIEngine('medium', board);
```

### 方法

#### calculateBestMove

```javascript
/**
 * 計算最佳著法位置
 * @returns {number} 著法位置索引 (0-8)
 * @throws {Error} 若棋盤無空位
 * 
 * 性能: ~100ms (JavaScript 單線程)
 * 難度影響: 簡單模式可能回傳非最優著法
 */
const bestMove = aiEngine.calculateBestMove();
board.setCell(bestMove, -1);  // AI 放置 O
```

#### evaluatePosition

```javascript
/**
 * Minimax 評估函數 (內部使用)
 * @param {GameBoard} board - 要評估的棋盤
 * @returns {number} 評估分數 (+10=AI勝, -10=玩家勝, 0=平局)
 * 
 * 注: 遞迴函數，不應直接調用
 */
const score = aiEngine.evaluatePosition(board);
```

---

## UIController API

### 全局應用入口

```javascript
/**
 * 初始化應用
 * @returns {void}
 */
app.init();  // 創建遊戲會話，綁定事件監聽器

/**
 * 應用主遊戲會話
 * @type {GameSession}
 */
app.session;  // 訪問遊戲狀態
```

### 棋盤交互

```javascript
/**
 * 玩家點擊棋盤上的位置
 * @param {number} index - 位置索引 (0-8)
 * @returns {void}
 */
app.handleBoardClick(index);
// 流程: 驗證 → 玩家著法 → 更新UI → AI著法 (非同步) → 檢查結束

/**
 * 更新棋盤視覺顯示
 * @returns {void}
 */
app.updateBoardDisplay();
// 同步 GameBoard 到 DOM
```

### 難度控制

```javascript
/**
 * 玩家選擇難度
 * @param {string} level - 'easy', 'medium', 'hard'
 * @returns {void}
 */
app.setDifficulty(level);
// 更新難度，顯示確認訊息，下次遊戲生效

/**
 * 顯示難度選擇UI
 * @returns {void}
 */
app.showDifficultyMenu();

/**
 * 隱藏難度選擇UI
 * @returns {void}
 */
app.hideDifficultyMenu();
```

### 結果與狀態

```javascript
/**
 * 顯示遊戲結果 (勝利/失敗/平局)
 * @param {string} result - 'win', 'lose', 'draw'
 * @returns {void}
 */
app.showResult(result);

/**
 * 重新開始遊戲
 * @returns {void}
 */
app.resetGame();
// 保持當前難度，清空棋盤，開始新遊戲

/**
 * 顯示載入狀態 (AI正在思考)
 * @param {boolean} loading - true=顯示, false=隱藏
 * @returns {void}
 */
app.setLoading(loading);
```

---

## 事件與回調

### DOM 事件監聽

```javascript
// 棋盤點擊事件 (每個位置)
document.getElementById('cell-0').addEventListener('click', () => {
  app.handleBoardClick(0);
});

// 難度選擇事件
document.getElementById('difficulty-easy').addEventListener('click', () => {
  app.setDifficulty('easy');
});

// 重新開始按鈕
document.getElementById('reset-button').addEventListener('click', () => {
  app.resetGame();
});
```

### 狀態變更通知 (可選觀察者模式)

```javascript
/**
 * 訂閱遊戲狀態變更
 * @param {string} eventType - 'move', 'gameOver', 'difficultyChange'
 * @param {Function} callback - 回調函數
 */
app.on('move', (data) => {
  console.log('新著法:', data.index, data.player);
});

app.on('gameOver', (data) => {
  console.log('遊戲結束:', data.winner);
});
```

---

## 契約驗證示例

### 完整遊戲流程

```javascript
// 初始化
const app = new TicTacToeApp('medium');
app.init();

// 玩家著法 (位置 4 = 中心)
app.handleBoardClick(4);
// GameState.board: [0,0,0,0,1,0,0,0,0]
// GameState.currentTurn: 'ai'

// AI 著法 (自動執行)
// GameState.board: [-1,0,0,0,1,0,0,0,0]
// GameState.currentTurn: 'player'

// 檢查遊戲狀態
console.log(app.session.gameState.isGameOver);  // false
console.log(app.session.gameState.winner);      // null

// 更改難度 (保持當前遊戲)
app.setDifficulty('hard');
// 難度會在下次 resetGame() 後生效

// 重新開始
app.resetGame();
// GameState.board: [0,0,0,0,0,0,0,0,0]
// GameState.difficulty: 'hard'
// GameState.currentTurn: 'player'
```

---

## Phase 1 契約完成檢查清單

- [x] GameBoard API 完整 ✅
- [x] GameState API 完整 ✅
- [x] AIEngine API 完整 ✅
- [x] UIController API 完整 ✅
- [x] 事件與回調定義 ✅
- [x] 驗證示例與流程 ✅

**Phase 1 契約 Status**: ✅ **完成**
