/**
 * UIController 單位測試
 * 測試 UI 更新和事件處理
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

describe('UIController', () => {
  let gameState;
  let aiEngine;
  let uiController;

  beforeEach(() => {
    // Mock window.confirm (jsdom doesn't implement it)
    // eslint-disable-next-line no-global-assign
    window.confirm = jest.fn(() => true);

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

  describe('初始化', () => {
    test('應該建立 UIController 實例', () => {
      expect(uiController).toBeDefined();
      expect(uiController.gameState).toBe(gameState);
      expect(uiController.aiEngine).toBe(aiEngine);
    });

    test('應該驗證所有必需的 DOM 元素', () => {
      expect(() => uiController.validateDOMElements()).not.toThrow();
    });

    test('應該拋出錯誤當缺少 DOM 元素', () => {
      document.body.innerHTML = '<div></div>';
      const ui = new UIController(gameState, aiEngine);
      expect(() => ui.validateDOMElements()).toThrow();
    });
  });

  describe('updateBoardDisplay()', () => {
    test('應該在玩家著法後更新棋盤', () => {
      gameState.makePlayerMove(0);
      uiController.updateBoardDisplay();

      const cell = document.querySelector('[data-index="0"]');
      expect(cell.textContent).toBe('X');
      expect(cell.className).toContain('player');
    });

    test('應該在 AI 著法後更新棋盤', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(4);
      uiController.updateBoardDisplay();

      const cell = document.querySelector('[data-index="4"]');
      expect(cell.textContent).toBe('O');
      expect(cell.className).toContain('ai');
    });

    test('應該清除空位置', () => {
      const cell = document.querySelector('[data-index="0"]');
      cell.textContent = '×';
      cell.className = 'game-board-cell player';

      gameState.reset();
      uiController.updateBoardDisplay();

      expect(cell.textContent).toBe('');
      expect(cell.className).toContain('game-board-cell');
      expect(cell.className).toContain('empty');
    });

    test('應該禁用已佔據的位置', () => {
      gameState.makePlayerMove(0);
      uiController.updateBoardDisplay();

      const cell = document.querySelector('[data-index="0"]');
      expect(cell.className).toContain('disabled');
    });

    test('應該在遊戲結束時禁用所有位置', () => {
      // 建立玩家贏的局面
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);

      uiController.updateBoardDisplay();

      const cells = document.querySelectorAll('[role="gridcell"]');
      expect(cells[0].className).toContain('disabled'); // Player move
      expect(cells[3].className).toContain('disabled'); // AI move
    });
  });

  describe('handleBoardClick()', () => {
    test('應該允許玩家點擊空位置著法', () => {
      const cell = document.querySelector('[data-index="0"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      expect(() => uiController.handleBoardClick(event)).not.toThrow();
      expect(gameState.board.getCell(0)).toBe(1);
    });

    test('應該忽略點擊已佔據的位置', () => {
      gameState.makePlayerMove(0);
      const cell = document.querySelector('[data-index="0"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      expect(() => uiController.handleBoardClick(event)).not.toThrow();
      expect(gameState.board.getCell(0)).toBe(1);
    });

    test('應該忽略在遊戲結束後的點擊', () => {
      // 建立玩家贏的局面
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);

      const cell = document.querySelector('[data-index="3"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: cell, enumerable: true });

      expect(() => uiController.handleBoardClick(event)).not.toThrow();
    });

    test('應該忽略點擊非棋盤元素', () => {
      const button = document.querySelector('button');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: button, enumerable: true });

      expect(() => uiController.handleBoardClick(event)).not.toThrow();
    });
  });

  describe('showResult() / hideResult()', () => {
    test('應該顯示玩家贏的訊息', () => {
      uiController.showResult('玩家贏了！');

      const section = document.getElementById('result-section');
      const message = document.getElementById('result-message');

      expect(section.style.display).not.toBe('none');
      expect(message.textContent).toContain('玩家贏了！');
    });

    test('應該顯示 AI 贏的訊息', () => {
      uiController.showResult('AI 贏了！');

      const message = document.getElementById('result-message');
      expect(message.textContent).toContain('AI 贏了！');
    });

    test('應該顯示平局訊息', () => {
      uiController.showResult('平局！');

      const message = document.getElementById('result-message');
      expect(message.textContent).toContain('平局！');
    });

    test('應該隱藏結果部分', () => {
      uiController.showResult('測試');
      uiController.hideResult();

      const section = document.getElementById('result-section');
      expect(section.style.display).toBe('none');
    });
  });

  describe('updateStats()', () => {
    test('應該更新玩家分數顯示', () => {
      gameState.playerScore = 5;
      uiController.updateStats();

      const score = document.getElementById('player-score');
      expect(score.textContent).toBe('5');
    });

    test('應該更新 AI 分數顯示', () => {
      gameState.aiScore = 3;
      uiController.updateStats();

      const score = document.getElementById('ai-score');
      expect(score.textContent).toBe('3');
    });

    test('應該更新平局分數顯示', () => {
      gameState.drawScore = 2;
      uiController.updateStats();

      const score = document.getElementById('draw-score');
      expect(score.textContent).toBe('2');
    });

    test('應該同時更新所有分數', () => {
      gameState.playerScore = 5;
      gameState.aiScore = 3;
      gameState.drawScore = 2;
      uiController.updateStats();

      expect(document.getElementById('player-score').textContent).toBe('5');
      expect(document.getElementById('ai-score').textContent).toBe('3');
      expect(document.getElementById('draw-score').textContent).toBe('2');
    });
  });

  describe('difficulty 選擇', () => {
    test('應該改變難度', () => {
      const hardBtn = document.querySelector('[data-difficulty="hard"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: hardBtn, enumerable: true });

      uiController.handleDifficultyChange(event);
      expect(gameState.difficulty).toBe('hard');
    });

    test('應該在改變難度後重置遊戲', () => {
      gameState.makePlayerMove(0);
      const easyBtn = document.querySelector('[data-difficulty="easy"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: easyBtn, enumerable: true });

      uiController.handleDifficultyChange(event);
      expect(gameState.board.isEmpty()).toBe(true);
    });

    test('應該保持分數當改變難度', () => {
      gameState.playerScore = 10;
      const hardBtn = document.querySelector('[data-difficulty="hard"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: hardBtn, enumerable: true });

      uiController.handleDifficultyChange(event);
      expect(gameState.playerScore).toBe(10);
    });

    test('應該更新難度按鈕的活躍狀態', () => {
      const hardBtn = document.querySelector('[data-difficulty="hard"]');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: hardBtn, enumerable: true });

      uiController.handleDifficultyChange(event);
      expect(hardBtn.className).toContain('active');
    });
  });

  describe('scheduleAIMove() / executeAIMove()', () => {
    test('應該在延遲後執行 AI 著法', (done) => {
      gameState.makePlayerMove(0);
      uiController.scheduleAIMove();

      setTimeout(() => {
        expect(gameState.currentTurn).toBe('player'); // 回合應該回到玩家
        done();
      }, 2100); // 等待大於 AI 延遲（1-2 秒）
    }, 10000); // Jest timeout: 10 秒

    test('應該顯示 AI 思考指示', (done) => {
      gameState.makePlayerMove(0);
      uiController.scheduleAIMove();

      // 等待 AI 思考指示器顯示 (延遲 500ms 後)
      setTimeout(() => {
        const thinking = document.getElementById('ai-thinking');
        expect(thinking.style.display).not.toBe('none');
        done();
      }, 600);
    }, 10000);

    test('應該在 AI 著法後隱藏思考指示', (done) => {
      gameState.makePlayerMove(0);
      uiController.scheduleAIMove();

      setTimeout(() => {
        const thinking = document.getElementById('ai-thinking');
        expect(thinking.style.display).toBe('none');
        done();
      }, 2100);
    }, 10000);
  });

  describe('handleRestart()', () => {
    test('應該重置遊戲狀態', () => {
      gameState.makePlayerMove(0);
      uiController.handleRestart();

      expect(gameState.board.isEmpty()).toBe(true);
      expect(gameState.isGameOver).toBe(false);
    });

    test('應該保留分數', () => {
      gameState.playerScore = 5;
      gameState.makePlayerMove(0);
      uiController.handleRestart();

      expect(gameState.playerScore).toBe(5);
    });

    test('應該隱藏結果訊息', () => {
      uiController.showResult('測試');
      uiController.handleRestart();

      const section = document.getElementById('result-section');
      expect(section.style.display).toBe('none');
    });

    test('應該更新棋盤顯示', () => {
      gameState.makePlayerMove(0);
      uiController.handleRestart();

      const cell = document.querySelector('[data-index="0"]');
      expect(cell.textContent).toBe('');
    });
  });

  describe('邊界情況', () => {
    test('應該處理多個連續點擊', () => {
      const cell0 = document.querySelector('[data-index="0"]');
      const cell1 = document.querySelector('[data-index="1"]');
      const event0 = new MouseEvent('click');
      const event1 = new MouseEvent('click');
      Object.defineProperty(event0, 'target', { value: cell0, enumerable: true });
      Object.defineProperty(event1, 'target', { value: cell1, enumerable: true });

      uiController.handleBoardClick(event0);
      expect(gameState.board.getCell(0)).toBe(1);

      // 應該拒絕在 AI 著法前的玩家著法
      expect(() => gameState.makePlayerMove(1)).toThrow();
    });

    test('應該在整個遊戲流程中保持一致性', () => {
      // 完成一個完整遊戲流程
      gameState.makePlayerMove(0);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(3);
      gameState.makeAIMove(6);
      gameState.makePlayerMove(1);

      uiController.updateBoardDisplay();
      uiController.updateStats();

      const state = gameState.getBoardState();
      expect(state[0]).toBe(1);
      expect(state[4]).toBe(-1);
      expect(state[3]).toBe(1);
    });
  });
});
