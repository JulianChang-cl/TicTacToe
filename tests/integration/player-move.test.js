/**
 * 整合測試：玩家著法流程
 * 測試完整的玩家著法從 UI 點擊到遊戲狀態更新的全過程
 */

// 載入遊戲類別模組（需按依賴順序）
// eslint-disable-next-line global-require
// eslint-disable-next-line no-unused-vars
const GameBoard = require('../../src/scripts/game-board');
// eslint-disable-next-line global-require
const DifficultyLevel = require('../../src/scripts/difficulty');
// eslint-disable-next-line global-require
const GameState = require('../../src/scripts/game-state');
// eslint-disable-next-line global-require
const AIEngine = require('../../src/scripts/ai-engine');
// eslint-disable-next-line global-require
const UIController = require('../../src/scripts/ui-controller');

describe('玩家著法整合測試', () => {
  let gameState;
  let aiEngine;
  let uiController;

  beforeEach(() => {
    // 建立模擬 DOM
    document.body.innerHTML = `
      <div class="game-container">
        <div role="grid" class="game-board">
          <div role="gridcell" data-index="0" class="game-board-cell"></div>
          <div role="gridcell" data-index="1" class="game-board-cell"></div>
          <div role="gridcell" data-index="2" class="game-board-cell"></div>
          <div role="gridcell" data-index="3" class="game-board-cell"></div>
          <div role="gridcell" data-index="4" class="game-board-cell"></div>
          <div role="gridcell" data-index="5" class="game-board-cell"></div>
          <div role="gridcell" data-index="6" class="game-board-cell"></div>
          <div role="gridcell" data-index="7" class="game-board-cell"></div>
          <div role="gridcell" data-index="8" class="game-board-cell"></div>
        </div>
        <div class="difficulty-selector">
          <button data-difficulty="easy">簡單</button>
          <button data-difficulty="medium">中等</button>
          <button data-difficulty="hard">困難</button>
        </div>
        <div id="result-section" class="result-section" style="display: none;">
          <div id="result-message"></div>
          <button data-action="restart">新遊戲</button>
        </div>
        <div id="ai-thinking" class="ai-thinking" style="display: none;"></div>
        <div class="stats">
          <span id="player-score">0</span>
          <span id="ai-score">0</span>
          <span id="draw-score">0</span>
        </div>
      </div>
    `;

    gameState = new GameState('medium');
    aiEngine = new AIEngine(gameState);
    uiController = new UIController(gameState, aiEngine);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('單一玩家著法流程', () => {
    test('玩家點擊 → 遊戲狀態更新 → UI 更新', () => {
      // 1. 玩家點擊位置 0
      const cell = document.querySelector('[data-index="0"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);

      // 2. 遊戲狀態應該更新
      expect(gameState.board.getCell(0)).toBe(1);
      expect(gameState.currentTurn).toBe('ai'); // 應該輪到 AI

      // 3. UI 應該反映變更
      uiController.updateBoardDisplay();
      const displayCell = document.querySelector('[data-index="0"]');
      expect(displayCell.textContent).toBe('X');
      expect(displayCell.className).toContain('player');
    });

    test('多個順序著法應該正確維護狀態', () => {
      // 著法序列：玩家 → AI → 玩家
      const moves = [
        { index: 0, target: 1 }, // 玩家
        { index: 4, target: -1 }, // AI
        { index: 2, target: 1 }, // 玩家
      ];

      for (const move of moves) {
        const cell = document.querySelector(`[data-index="${move.index}"]`);
        const event = new MouseEvent('click');
        Object.defineProperty(event, 'target', { value: cell, enumerable: true });

        if (move.target === 1) {
          uiController.handleBoardClick(event);
        } else {
          gameState.makeAIMove(move.index);
        }

        expect(gameState.board.getCell(move.index)).toBe(move.target);
      }

      uiController.updateBoardDisplay();
      expect(gameState.board.getCell(0)).toBe(1);
      expect(gameState.board.getCell(4)).toBe(-1);
      expect(gameState.board.getCell(2)).toBe(1);
    });
  });

  describe('著法驗證和約束', () => {
    test('不應該允許在已佔據的位置著法', () => {
      const cell = document.querySelector('[data-index="0"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      // 第一次著法應該成功
      uiController.handleBoardClick(event);
      expect(gameState.board.getCell(0)).toBe(1);

      // 第二次著法到同一位置應該失敗
      expect(() => uiController.handleBoardClick(event)).toThrow();
    });

    test('不應該允許在遊戲結束後著法', () => {
      // 建立玩家贏的局面
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);

      expect(gameState.isGameOver).toBe(true);

      const cell = document.querySelector('[data-index="5"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      expect(() => uiController.handleBoardClick(event)).not.toThrow();
      expect(gameState.board.getCell(5)).toBe(0); // 著法不應該被執行
    });

    test('應該拒絕無效的著法請求', () => {
      gameState.makePlayerMove(0);
      expect(() => gameState.makePlayerMove(0)).toThrow();
    });
  });

  describe('玩家著法的視覺回饋', () => {
    test('著法後位置應該顯示玩家符號', () => {
      const cell = document.querySelector('[data-index="4"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);
      uiController.updateBoardDisplay();

      expect(cell.textContent).toBe('×');
    });

    test('著法後位置應該加上玩家樣式類', () => {
      const cell = document.querySelector('[data-index="4"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);
      uiController.updateBoardDisplay();

      expect(cell.className).toContain('player');
    });

    test('著法後位置應該被標記為已禁用', () => {
      const cell = document.querySelector('[data-index="4"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);
      uiController.updateBoardDisplay();

      expect(cell.className).toContain('disabled');
    });

    test('所有空位置應該保持可點擊', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(4);
      uiController.updateBoardDisplay();

      const cells = document.querySelectorAll('[role="gridcell"]');
      expect(cells[1].className).not.toContain('disabled');
      expect(cells[2].className).not.toContain('disabled');
      expect(cells[3].className).not.toContain('disabled');
    });
  });

  describe('著法後的遊戲狀態', () => {
    test('著法應該增加著法計數', () => {
      expect(gameState.moveCount).toBe(0);

      const cell = document.querySelector('[data-index="0"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);
      expect(gameState.moveCount).toBe(1);
    });

    test('著法應該記錄最後著法位置', () => {
      const cell = document.querySelector('[data-index="5"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);
      expect(gameState.lastMoveIndex).toBe(5);
    });

    test('著法應該切換回合', () => {
      expect(gameState.currentTurn).toBe('player'); // 玩家

      const cell = document.querySelector('[data-index="0"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);
      expect(gameState.currentTurn).toBe('ai'); // AI
    });
  });

  describe('著法導致遊戲結束', () => {
    test('著法贏得遊戲應該設置獲勝者', () => {
      // 建立玩家即將贏的局面
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);

      // 玩家著法贏
      const cell = document.querySelector('[data-index="2"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);

      expect(gameState.isGameOver).toBe(true);
      expect(gameState.winner).toBe('player');
    });

    test('著法導致平局應該設置狀態', () => {
      // 建立平局局面
      gameState.makePlayerMove(0);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(2);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(4);
      gameState.makeAIMove(5);
      gameState.makePlayerMove(6);
      gameState.makeAIMove(7);

      const cell = document.querySelector('[data-index="8"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);

      expect(gameState.isGameOver).toBe(true);
      expect(gameState.winner).toBeNull();
    });

    test('著法贏得遊戲應該更新分數', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);

      const cell = document.querySelector('[data-index="2"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      expect(gameState.playerScore).toBe(0);
      uiController.handleBoardClick(event);
      expect(gameState.playerScore).toBe(1);
    });
  });

  describe('邊界情況和特殊場景', () => {
    test('應該處理連心位置著法', () => {
      const cell = document.querySelector('[data-index="4"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);
      expect(gameState.board.getCell(4)).toBe(1);
      expect(gameState.currentTurn).toBe('ai');
    });

    test('應該處理角位置著法', () => {
      const corners = [0, 2, 6, 8];
      for (const corner of corners) {
        gameState.reset();
        const cell = document.querySelector(`[data-index="${corner}"]`);
        const event = new MouseEvent('click');
        Object.defineProperty(event, 'target', { value: cell, enumerable: true });

        uiController.handleBoardClick(event);
        expect(gameState.board.getCell(corner)).toBe(1);
      }
    });

    test('應該處理邊位置著法', () => {
      const edges = [1, 3, 5, 7];
      for (const edge of edges) {
        gameState.reset();
        const cell = document.querySelector(`[data-index="${edge}"]`);
        const event = new MouseEvent('click');
        Object.defineProperty(event, 'target', { value: cell, enumerable: true });

        uiController.handleBoardClick(event);
        expect(gameState.board.getCell(edge)).toBe(1);
      }
    });

    test('著法後應該允許重新開始', () => {
      const cell = document.querySelector('[data-index="0"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);
      uiController.handleRestart();

      expect(gameState.board.isEmpty()).toBe(true);
      expect(gameState.isGameOver).toBe(false);
    });

    test('著法後應該允許改變難度', () => {
      const cell = document.querySelector('[data-index="0"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);

      const hardBtn = document.querySelector('[data-difficulty="hard"]');
      const diffEvent = new MouseEvent('click');
      Object.defineProperty(diffEvent, 'target', { value: hardBtn, enumerable: true });

      uiController.handleDifficultyChange(diffEvent);
      expect(gameState.difficulty).toBe('hard');
      expect(gameState.board.isEmpty()).toBe(true);
    });
  });

  describe('多局連續遊戲', () => {
    test('應該在重置後正確進行下一局', () => {
      // 第一局
      gameState.makePlayerMove(0);
      expect(gameState.board.getCell(0)).toBe(1);

      // 重置
      gameState.reset();
      uiController.updateBoardDisplay();

      // 第二局
      const cell = document.querySelector('[data-index="4"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      uiController.handleBoardClick(event);
      expect(gameState.board.getCell(4)).toBe(1);
      expect(gameState.board.getCell(0)).toBe(0); // 第一局的位置應該被清除
    });

    test('分數應該跨局保持', () => {
      gameState.playerScore = 5;
      gameState.makePlayerMove(0);
      gameState.reset();

      expect(gameState.playerScore).toBe(5);
    });

    test('應該在連續遊戲中正確追蹤著法數', () => {
      gameState.makePlayerMove(0);
      expect(gameState.moveCount).toBe(1);

      gameState.reset();
      expect(gameState.moveCount).toBe(0);

      gameState.makePlayerMove(4);
      expect(gameState.moveCount).toBe(1);
    });
  });
});
