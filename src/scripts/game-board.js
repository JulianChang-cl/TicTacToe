/**
 * GameBoard 類別 - 遊戲棋盤的狀態管理與操作
 * 代表 3x3 井字遊戲棋盤
 */
class GameBoard {
  /**
   * 初始化遊戲棋盤
   * 棋盤包含 9 個位置 (0-8)，初始狀態全為空
   */
  constructor() {
    // 棋盤狀態: 0=空, 1=玩家(X), -1=AI(O)
    this.cells = new Array(9).fill(0);
  }

  /**
   * 取得指定位置的棋子
   * @param {number} index - 位置索引 (0-8)
   * @returns {number} 0=空, 1=玩家, -1=AI
   * @throws {Error} 如果索引無效
   */
  getCell(index) {
    this.validateIndex(index);
    return this.cells[index];
  }

  /**
   * 在指定位置放置棋子
   * @param {number} index - 位置索引 (0-8)
   * @param {number} value - 棋子值 (1=玩家, -1=AI)
   * @throws {Error} 如果位置已佔據或值無效
   */
  setCell(index, value) {
    this.validateIndex(index);
    if (this.cells[index] !== 0) {
      throw new Error(`位置 ${index} 已被佔據`);
    }
    if (value !== 1 && value !== -1) {
      throw new Error(`無效的棋子值: ${value}`);
    }
    this.cells[index] = value;
  }

  /**
   * 檢查棋盤是否還有空位
   * @returns {boolean} true=有空位, false=棋盤滿
   */
  isEmpty() {
    return this.cells.some((cell) => cell === 0);
  }

  /**
   * 檢查指定位置是否可著法
   * @param {number} index - 位置索引 (0-8)
   * @returns {boolean} true=可著, false=已佔據或無效
   */
  canMove(index) {
    if (index < 0 || index > 8) {
      return false;
    }
    return this.cells[index] === 0;
  }

  /**
   * 重置棋盤為初始狀態
   */
  reset() {
    this.cells = new Array(9).fill(0);
  }

  /**
   * 取得所有空位的索引
   * @returns {Array<number>} 空位索引列表
   */
  getEmptyCells() {
    return this.cells
      .map((cell, index) => (cell === 0 ? index : null))
      .filter((index) => index !== null);
  }

  /**
   * 取得棋盤副本 (用於 AI 評估)
   * @returns {Array<number>} 棋盤狀態的副本
   */
  getCellsCopy() {
    return [...this.cells];
  }

  /**
   * 設定棋盤狀態 (用於 AI 評估)
   * @param {Array<number>} cells - 新的棋盤狀態
   */
  setCells(cells) {
    if (cells.length !== 9) {
      throw new Error('棋盤必須包含 9 個位置');
    }
    this.cells = [...cells];
  }

  /**
   * 驗證位置索引有效性
   * @private
   * @param {number} index - 位置索引
   * @throws {Error} 如果索引無效
   */
  validateIndex(index) {
    if (!Number.isInteger(index) || index < 0 || index > 8) {
      throw new Error(`無效的位置索引: ${index}`);
    }
  }
}

// 導出 GameBoard 類別
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameBoard;
}

// 在瀏覽器環境中暴露到全域
if (typeof window !== 'undefined') {
  window.GameBoard = GameBoard;
}
