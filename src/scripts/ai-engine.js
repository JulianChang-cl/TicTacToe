/**
 * AIEngine 類別 - AI 著法策略引擎
 * 使用 Minimax 演算法與優先級決策實現 AI 邏輯
 */

class AIEngine {
  /**
   * 初始化 AI 引擎
   * 支援兩種使用方式：
   * 1. new AIEngine(gameState) - 推薦用於測試
   * 2. new AIEngine(difficulty, board) - 用於生產環境
   * @param {GameState|string} gameStateOrDifficulty - GameState 物件或難度等級字串
   * @param {GameBoard} [board] - 遊戲棋盤引用 (當第一個參數為難度字串時使用)
   */
  constructor(gameStateOrDifficulty, board) {
    // 使用全域 DifficultyLevel（由 webpack 或瀏覽器全域暴露）
    const DifficultyLevel = typeof window !== 'undefined' ? window.DifficultyLevel : global.DifficultyLevel;
    if (!DifficultyLevel) {
      throw new Error('DifficultyLevel class not found');
    }
    
    // 判斷是傳入 GameState 還是 difficulty + board
    if (typeof gameStateOrDifficulty === 'object' && gameStateOrDifficulty !== null && 'board' in gameStateOrDifficulty) {
      // 第一個參數是 GameState 物件
      this.gameState = gameStateOrDifficulty;
      this.difficulty = gameStateOrDifficulty.difficulty;
      this.board = gameStateOrDifficulty.board;
    } else {
      // 第一個參數是難度字串
      const difficulty = gameStateOrDifficulty;
      if (!DifficultyLevel.isValid(difficulty)) {
        throw new Error(`無效的難度: ${difficulty}`);
      }
      this.difficulty = difficulty;
      this.board = board;
      this.gameState = null; // 無 gameState 參考
    }
    
    this.maxDepth = 9; // Minimax 最大深度
  }

  /**
   * 計算最佳著法
   * 優先級: (1) 防守 (阻止玩家勝利)
   *        (2) 攻擊 (自身勝利)
   *        (3) 策略 (Minimax)
   * @returns {number} 最佳著法位置 (0-8)
   */
  calculateBestMove() {
    // 使用全域 GameBoard（由 webpack 或瀏覽器全域暴露）
    const GameBoard = typeof window !== 'undefined' ? window.GameBoard : global.GameBoard;
    if (!GameBoard) {
      throw new Error('GameBoard class not found');
    }
    const emptyCells = this.board.getEmptyCells();

    if (emptyCells.length === 0) {
      throw new Error('棋盤已滿，無法著法');
    }

    // 簡單難度：有概率使用隨機著法
    if (this.difficulty === 'easy') {
      if (Math.random() < 0.2) {
        // 20% 隨機選擇
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
      }
    }

    // 嘗試防守著法 (阻止玩家在下一步勝利)
    const defensiveMove = this.getDefensiveMove();
    if (defensiveMove !== null && this.shouldUseStrategy('defense')) {
      return defensiveMove;
    }

    // 嘗試攻擊著法 (自身在下一步勝利)
    const offensiveMove = this.getOffensiveMove();
    if (offensiveMove !== null && this.shouldUseStrategy('offense')) {
      return offensiveMove;
    }

    // 中等難度：有小概率隨機選擇
    if (this.difficulty === 'medium' && Math.random() < 0.05) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // 使用 Minimax 策略著法
    let bestScore = -Infinity;
    let bestMove = emptyCells[0];

    for (const move of emptyCells) {
      const boardCopy = this.board.getCellsCopy();
      const testBoard = new GameBoard();
      testBoard.setCells(boardCopy);
      testBoard.setCell(move, -1); // AI 是 -1

      const score = this.minimax(testBoard, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  /**
   * 取得防守著法 (阻止玩家勝利)
   * @returns {number|null} 防守著法位置或 null
   */
  getDefensiveMove() {
    // 使用全域 GameBoard（由 webpack 或瀏覽器全域暴露）
    const GameBoard = typeof window !== 'undefined' ? window.GameBoard : global.GameBoard;
    if (!GameBoard) {
      throw new Error('GameBoard class not found');
    }
    const emptyCells = this.board.getEmptyCells();

    for (const cell of emptyCells) {
      const boardCopy = this.board.getCellsCopy();
      const testBoard = new GameBoard();
      testBoard.setCells(boardCopy);
      testBoard.setCell(cell, 1); // 模擬玩家著法

      // 檢查玩家是否會勝利
      if (this.isWinningPosition(testBoard, 1)) {
        // 放置 AI 棋子阻止勝利
        testBoard.setCells(boardCopy); // 重置
        testBoard.setCell(cell, -1); // 放置 AI 棋子
        return cell;
      }
    }

    return null;
  }

  /**
   * 取得攻擊著法 (自身勝利)
   * @returns {number|null} 攻擊著法位置或 null
   */
  getOffensiveMove() {
    // 使用全域 GameBoard（由 webpack 或瀏覽器全域暴露）
    const GameBoard = typeof window !== 'undefined' ? window.GameBoard : global.GameBoard;
    if (!GameBoard) {
      throw new Error('GameBoard class not found');
    }
    const emptyCells = this.board.getEmptyCells();

    for (const cell of emptyCells) {
      const boardCopy = this.board.getCellsCopy();
      const testBoard = new GameBoard();
      testBoard.setCells(boardCopy);
      testBoard.setCell(cell, -1); // AI 著法

      // 檢查 AI 是否會勝利
      if (this.isWinningPosition(testBoard, -1)) {
        return cell;
      }
    }

    return null;
  }

  /**
   * Minimax 演算法 - 評估著法的價值
   * @private
   * @param {GameBoard} board - 測試棋盤
   * @param {number} depth - 遞迴深度
   * @param {boolean} isMaximizing - 是否最大化 (AI 輪)
   * @returns {number} 評估分數
   */
  minimax(board, depth, isMaximizing) {
    // 使用全域 GameBoard（由 webpack 或瀏覽器全域暴露）
    const GameBoard = typeof window !== 'undefined' ? window.GameBoard : global.GameBoard;
    if (!GameBoard) {
      throw new Error('GameBoard class not found');
    }
    
    // 檢查遊戲結束狀態
    if (this.isWinningPosition(board, -1)) {
      return 10 - depth; // AI 勝利，分數越高越好，深度越淺越優先
    }
    if (this.isWinningPosition(board, 1)) {
      return depth - 10; // 玩家勝利，分數越低越好
    }

    const emptyCells = board.getEmptyCells();
    if (emptyCells.length === 0) {
      return 0; // 平局
    }

    if (isMaximizing) {
      // AI 輪 - 最大化分數
      let maxScore = -Infinity;
      for (const cell of emptyCells) {
        const newBoard = new GameBoard();
        newBoard.setCells(board.getCellsCopy());
        newBoard.setCell(cell, -1);
        const score = this.minimax(newBoard, depth + 1, false);
        maxScore = Math.max(maxScore, score);
      }
      return maxScore;
    } else {
      // 玩家輪 - 最小化分數
      let minScore = Infinity;
      for (const cell of emptyCells) {
        const newBoard = new GameBoard();
        newBoard.setCells(board.getCellsCopy());
        newBoard.setCell(cell, 1);
        const score = this.minimax(newBoard, depth + 1, true);
        minScore = Math.min(minScore, score);
      }
      return minScore;
    }
  }

  /**
   * 檢查是否為勝利位置
   * @private
   * @param {GameBoard} board - 測試棋盤
   * @param {number} player - 玩家標記 (1 或 -1)
   * @returns {boolean}
   */
  isWinningPosition(board, player) {
    const cells = board.cells;
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const line of winningLines) {
      const [a, b, c] = line;
      if (cells[a] === player && cells[b] === player && cells[c] === player) {
        return true;
      }
    }
    return false;
  }

  /**
   * 決定是否使用指定策略
   * @private
   * @param {string} strategyType - 策略類型 ('defense' 或 'offense')
   * @returns {boolean}
   */
  shouldUseStrategy(strategyType) {
    if (this.difficulty === 'hard') {
      return true; // Hard 模式強制使用最優策略
    }

    const strategy = DifficultyLevel.getStrategy(this.difficulty);
    const probability =
      strategyType === 'defense' ? strategy.defense : strategy.offense;

    return Math.random() < probability;
  }
}

// 導出 AIEngine 類別
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIEngine;
}

// 在瀏覽器環境中暴露到全域
if (typeof window !== 'undefined') {
  window.AIEngine = AIEngine;
}
