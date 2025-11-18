/**
 * GameState 類別 - 遊戲邏輯與狀態管理
 * 管理遊戲進行、輪次、勝敗判定
 */

// 支援 CommonJS require（Node.js / Jest 環境）
// eslint-disable-next-line global-require
const GameBoardModule = typeof require !== 'undefined' ? require('./game-board') : null;

class GameState {
  /**
   * 初始化遊戲狀態
   * @param {string} difficulty - 難度等級 ('easy', 'medium', 'hard')
   */
  constructor(difficulty = 'medium') {
    // 若在 Node.js 環境，使用 require 載入的 GameBoard；否則使用全域 GameBoard
    const GameBoard = GameBoardModule || (typeof window !== 'undefined' ? window.GameBoard : global.GameBoard);
    this.board = new GameBoard();
    this.currentTurn = 'player'; // 玩家先手
    this.isGameOver = false;
    this.winner = null; // null | 'player' | 'ai' | 'draw'
    this.difficulty = difficulty;
    this.moveCount = 0;
    this.lastMoveIndex = null;
    
    // 遊戲統計
    this.playerScore = 0;
    this.aiScore = 0;
    this.drawScore = 0;
  }

  /**
   * 玩家著法
   * @param {number} index - 著法位置 (0-8)
   * @returns {boolean} 著法是否成功
   */
  makePlayerMove(index) {
    if (!this.isValidMove(index)) {
      return false;
    }
    if (this.currentTurn !== 'player') {
      throw new Error('不是玩家的輪次');
    }

    this.board.setCell(index, 1); // 玩家是 1 (X)
    this.lastMoveIndex = index;
    this.moveCount++;

    // 檢查玩家是否勝利
    if (this.checkWinner() === 'player') {
      this.isGameOver = true;
      this.winner = 'player';
      this.playerScore++;
      return true;
    }

    // 檢查是否平局
    if (this.checkDraw()) {
      this.isGameOver = true;
      this.winner = 'draw';
      this.drawScore++;
      return true;
    }

    // 輪到 AI
    this.currentTurn = 'ai';
    return true;
  }

  /**
   * AI 著法 (由外部 AIEngine 呼叫)
   * @param {number} index - AI 著法位置
   * @returns {boolean} 著法是否成功
   */
  makeAIMove(index) {
    if (!this.isValidMove(index)) {
      return false;
    }
    if (this.currentTurn !== 'ai') {
      throw new Error('不是 AI 的輪次');
    }

    this.board.setCell(index, -1); // AI 是 -1 (O)
    this.lastMoveIndex = index;
    this.moveCount++;

    // 檢查 AI 是否勝利
    if (this.checkWinner() === 'ai') {
      this.isGameOver = true;
      this.winner = 'ai';
      this.aiScore++;
      return true;
    }

    // 檢查是否平局
    if (this.checkDraw()) {
      this.isGameOver = true;
      this.winner = 'draw';
      this.drawScore++;
      return true;
    }

    // 輪到玩家
    this.currentTurn = 'player';
    return true;
  }

  /**
   * 檢查是否有勝者
   * @returns {string|null} 'player' | 'ai' | null
   */
  checkWinner() {
    const cells = this.board.cells;
    const winningLines = [
      // 行
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // 列
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // 對角線
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const line of winningLines) {
      const [a, b, c] = line;
      if (cells[a] !== 0 && cells[a] === cells[b] && cells[b] === cells[c]) {
        return cells[a] === 1 ? 'player' : 'ai';
      }
    }

    return null;
  }

  /**
   * 檢查是否平局 (棋盤滿且無勝者)
   * @returns {boolean}
   */
  checkDraw() {
    return !this.board.isEmpty() && this.checkWinner() === null;
  }

  /**
   * 驗證著法是否有效
   * @param {number} index - 位置索引
   * @returns {boolean}
   */
  isValidMove(index) {
    if (this.isGameOver) {
      return false;
    }
    return this.board.canMove(index);
  }

  /**
   * 重置遊戲
   */
  reset() {
    this.board.reset();
    this.currentTurn = 'player';
    this.isGameOver = false;
    this.winner = null;
    this.moveCount = 0;
    this.lastMoveIndex = null;
  }

  /**
   * 設定難度
   * @param {string} level - 難度等級
   */
  setDifficulty(level) {
    if (!['easy', 'medium', 'hard'].includes(level)) {
      throw new Error(`無效的難度: ${level}`);
    }
    this.difficulty = level;
  }

  /**
   * 取得目前的棋盤狀態
   * @returns {Array<number>}
   */
  getBoardState() {
    return this.board.getCellsCopy();
  }
}

// 導出 GameState 類別
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameState;
}
