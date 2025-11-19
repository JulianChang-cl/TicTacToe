/**
 * UIController 類別 - UI 控制器與事件處理
 * 管理 DOM 更新、事件監聽、使用者互動
 */

class UIController {
  /**
   * 初始化 UI 控制器
   * @param {GameState} gameState - 遊戲狀態引用
   * @param {AIEngine} aiEngine - AI 引擎引用
   */
  constructor(gameState, aiEngine) {
    this.gameState = gameState;
    this.aiEngine = aiEngine;
    this.isAIThinking = false;
    this.aiThinkingTimeout = null;

    // DOM 元素快取
    this.elements = {
      board: document.querySelector('[role="grid"]'),
      cells: Array.from(document.querySelectorAll('[role="gridcell"]')),
      difficultyBtns: Array.from(document.querySelectorAll('[data-difficulty]')),
      aiThinkingIndicator: document.getElementById('ai-thinking'),
      resultSection: document.getElementById('result-section'),
      resultMessage: document.getElementById('result-message'),
      restartBtn: document.querySelector('[data-action="restart"]'),
      playerScore: document.getElementById('player-score'),
      aiScore: document.getElementById('ai-score'),
      drawScore: document.getElementById('draw-score'),
    };

    // 驗證必要 DOM 元素
    this.validateDOMElements();
  }

  /**
   * 驗證必要 DOM 元素存在
   * @private
   */
  validateDOMElements() {
    const required = ['board', 'cells', 'resultSection', 'resultMessage'];
    for (const key of required) {
      const element = this.elements[key];
      if (!element || (Array.isArray(element) && element.length === 0)) {
        throw new Error(`找不到必要 DOM 元素: ${key}`);
      }
    }
  }

  /**
   * 初始化所有事件監聽器
   */
  init() {
    // 棋盤點擊事件
    if (this.elements.board) {
      this.elements.board.addEventListener('click', (e) =>
        this.handleBoardClick(e),
      );
    }

    // 難度選擇事件
    for (const btn of this.elements.difficultyBtns) {
      btn.addEventListener('click', (e) => this.handleDifficultyChange(e));
    }

    // 重新開始事件
    if (this.elements.restartBtn) {
      this.elements.restartBtn.addEventListener('click', () =>
        this.handleRestart(),
      );
    }

    // 初始化顯示
    this.updateBoardDisplay();
    this.updateStats();
    this.hideResult();
  }

  /**
   * 處理棋盤點擊事件
   * @param {Event} event - 點擊事件
   */
  handleBoardClick(event) {
    const cell = event.target.closest('[role="gridcell"]');
    if (!cell) {
      return;
    }

    const index = parseInt(cell.getAttribute('data-index'), 10);

    // 檢查遊戲狀態
    if (this.gameState.isGameOver) {
      console.warn('遊戲已結束，無法著法');
      return;
    }

    if (this.isAIThinking) {
      console.warn('AI 正在思考，請稍候');
      return;
    }

    // 驗證著法有效性
    if (!this.gameState.isValidMove(index)) {
      console.warn(`位置 ${index} 已被佔用或無效`);
      return;
    }

    // 執行玩家著法
    this.gameState.makePlayerMove(index);
    this.updateBoardDisplay();

    // 檢查遊戲是否結束 (玩家勝利或平局)
    if (this.gameState.isGameOver) {
      this.handleGameEnd();
      return;
    }

    // AI 著法 (延遲顯示思考狀態)
    this.scheduleAIMove();
  }

  /**
   * 排定 AI 著法執行
   * @private
   */
  scheduleAIMove() {
    // 顯示 AI 思考指示器 (延遲 500ms)
    this.aiThinkingTimeout = setTimeout(() => {
      this.showAIThinking();
    }, 500);

    // 執行 AI 著法 (延遲 1-2s)
    setTimeout(() => {
      clearTimeout(this.aiThinkingTimeout);
      this.executeAIMove();
    }, 1000 + Math.random() * 1000);
  }

  /**
   * 執行 AI 著法
   * @private
   */
  executeAIMove() {
    try {
      this.isAIThinking = true;
      this.showAIThinking();

      // 計算 AI 最佳著法
      const bestMove = this.aiEngine.calculateBestMove();

      // 執行 AI 著法
      this.gameState.makeAIMove(bestMove);
      this.updateBoardDisplay();

      this.hideAIThinking();
      this.isAIThinking = false;

      // 檢查遊戲是否結束
      if (this.gameState.isGameOver) {
        this.handleGameEnd();
      }
    } catch (error) {
      console.error('AI 著法發生錯誤:', error);
      this.hideAIThinking();
      this.isAIThinking = false;
    }
  }

  /**
   * 處理難度選擇變更
   * @param {Event} event - 點擊事件
   */
  handleDifficultyChange(event) {
    const btn = event.target.closest('[data-difficulty]');
    if (!btn) {
      return;
    }

    // 檢查遊戲狀態
    if (!this.gameState.isGameOver && this.gameState.moveCount > 0) {
      if (!confirm('改變難度將重新開始遊戲，是否繼續？')) {
        return;
      }
    }

    const newDifficulty = btn.getAttribute('data-difficulty');
    this.setDifficulty(newDifficulty);
    this.handleRestart();
  }

  /**
   * 設置難度級別
   * @param {string} difficulty - 難度級別
   */
  setDifficulty(difficulty) {
    // 使用全域 DifficultyLevel（由 webpack 或瀏覽器全域暴露）
    const DifficultyLevel = typeof window !== 'undefined' ? window.DifficultyLevel : global.DifficultyLevel;
    if (!DifficultyLevel) {
      throw new Error('DifficultyLevel class not found');
    }
    
    if (!DifficultyLevel.isValid(difficulty)) {
      console.error(`無效的難度: ${difficulty}`);
      return;
    }

    this.gameState.setDifficulty(difficulty);
    this.aiEngine.difficulty = difficulty;

    // 更新難度按鈕狀態
    for (const btn of this.elements.difficultyBtns) {
      const btnDifficulty = btn.getAttribute('data-difficulty');
      if (btnDifficulty === difficulty) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    }
  }

  /**
   * 處理遊戲結束
   * @private
   */
  handleGameEnd() {
    const result = this.gameState.winner;
    let message = '';

    if (result === 'player') {
      message = '🎉 你贏了！';
    } else if (result === 'ai') {
      message = '😢 AI 贏了！';
    } else if (result === 'draw') {
      message = '🤝 平局！';
    }

    this.updateStats();
    this.showResult(message);
  }

  /**
   * 處理重新開始遊戲
   * @private
   */
  handleRestart() {
    clearTimeout(this.aiThinkingTimeout);
    this.isAIThinking = false;
    this.hideAIThinking();
    this.hideResult();
    this.gameState.reset();
    this.updateBoardDisplay();
  }

  /**
   * 更新棋盤顯示
   */
  updateBoardDisplay() {
    const cells = this.gameState.getBoardState();

    for (let i = 0; i < cells.length; i++) {
      const cellElement = this.elements.cells[i];
      const cellValue = cells[i];

      // 清除舊狀態
      cellElement.classList.remove('player', 'ai', 'empty');
      cellElement.textContent = '';

      if (cellValue === 1) {
        cellElement.classList.add('player');
        cellElement.textContent = 'X';
        cellElement.setAttribute('aria-label', `位置 ${i}: X`);
      } else if (cellValue === -1) {
        cellElement.classList.add('ai');
        cellElement.textContent = 'O';
        cellElement.setAttribute('aria-label', `位置 ${i}: O`);
      } else {
        cellElement.classList.add('empty');
        cellElement.setAttribute('aria-label', `位置 ${i}: 空`);
      }

      // 禁用已滿位置
      cellElement.classList.toggle('disabled', cellValue !== 0);
    }
  }

  /**
   * 顯示結果訊息
   * @param {string} message - 結果訊息
   */
  showResult(message) {
    this.elements.resultMessage.textContent = message;
    this.elements.resultSection.style.display = 'flex';
    this.elements.resultSection.setAttribute('aria-hidden', 'false');
  }

  /**
   * 隱藏結果訊息
   * @private
   */
  hideResult() {
    this.elements.resultSection.style.display = 'none';
    this.elements.resultSection.setAttribute('aria-hidden', 'true');
  }

  /**
   * 顯示 AI 思考指示器
   * @private
   */
  showAIThinking() {
    if (this.elements.aiThinkingIndicator) {
      this.elements.aiThinkingIndicator.style.display = 'block';
      this.elements.aiThinkingIndicator.setAttribute('aria-hidden', 'false');
    }
  }

  /**
   * 隱藏 AI 思考指示器
   * @private
   */
  hideAIThinking() {
    if (this.elements.aiThinkingIndicator) {
      this.elements.aiThinkingIndicator.style.display = 'none';
      this.elements.aiThinkingIndicator.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * 更新遊戲統計顯示
   * @private
   */
  updateStats() {
    if (this.elements.playerScore) {
      this.elements.playerScore.textContent = this.gameState.playerScore || 0;
    }
    if (this.elements.aiScore) {
      this.elements.aiScore.textContent = this.gameState.aiScore || 0;
    }
    if (this.elements.drawScore) {
      this.elements.drawScore.textContent = this.gameState.drawScore || 0;
    }
  }
}

// 導出 UIController 類別
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIController;
}

// 在瀏覽器環境中暴露到全域
if (typeof window !== 'undefined') {
  window.UIController = UIController;
}
