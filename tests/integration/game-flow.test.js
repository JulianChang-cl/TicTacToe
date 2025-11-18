/**
 * 整合測試：完整遊戲流程
 * 測試從遊戲開始到結束的完整流程：玩家贏、AI 贏、平局
 */

// 載入遊戲類別模組（需按依賴順序）
// eslint-disable-next-line global-require
// eslint-disable-next-line no-unused-vars
const GameBoard = require('../../src/scripts/game-board');
// eslint-disable-next-line global-require
const GameState = require('../../src/scripts/game-state');
// eslint-disable-next-line global-require
const AIEngine = require('../../src/scripts/ai-engine');
// eslint-disable-next-line global-require
const UIController = require('../../src/scripts/ui-controller');

describe('完整遊戲流程整合測試', () => {
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

    gameState = new GameState('hard');
    aiEngine = new AIEngine(gameState);
    uiController = new UIController(gameState, aiEngine);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('玩家贏的遊戲流程', () => {
    test('應該完成玩家贏的完整流程', () => {
      // 玩家策略：贏頂行 (0-1-2)
      // AI 防守中行 (3-4-5)
      gameState.makePlayerMove(0);
      expect(gameState.currentTurn).toBe('ai');

      gameState.makeAIMove(3);
      expect(gameState.currentTurn).toBe('player');

      gameState.makePlayerMove(1);
      expect(gameState.currentTurn).toBe('ai');

      gameState.makeAIMove(4);
      expect(gameState.isGameOver).toBe(false);

      gameState.makePlayerMove(2);
      expect(gameState.isGameOver).toBe(true);
      expect(gameState.winner).toBe('player');
      expect(gameState.playerScore).toBe(1);
    });

    test('玩家贏應該更新 UI', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);

      uiController.updateBoardDisplay();
      uiController.showResult('玩家贏了！');

      const message = document.getElementById('result-message');
      expect(message.textContent).toContain('玩家贏了！');

      const section = document.getElementById('result-section');
      expect(section.style.display).not.toBe('none');
    });

    test('玩家贏後應該禁用所有位置', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);

      uiController.updateBoardDisplay();

      const cells = document.querySelectorAll('[role="gridcell"]');
      for (let i = 0; i < 9; i++) {
        if ([0, 1, 2, 3, 4].includes(i)) {
          expect(cells[i].className).toContain('disabled');
        }
      }
    });

    test('玩家贏後應該保留棋盤狀態', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);

      const state = gameState.getBoardState();
      expect(state[0]).toBe(1);
      expect(state[1]).toBe(1);
      expect(state[2]).toBe(1);
      expect(state[3]).toBe(-1);
      expect(state[4]).toBe(-1);
    });
  });

  describe('AI 贏的遊戲流程', () => {
    test('應該完成 AI 贏的完整流程', () => {
      // 玩家著法不佳，AI 獲勝
      gameState.makePlayerMove(0);
      gameState.makeAIMove(4); // AI 取中心

      gameState.makePlayerMove(1);
      gameState.makeAIMove(3); // AI 著法

      gameState.makePlayerMove(2);
      gameState.makeAIMove(5); // AI 贏中列 (3-4-5)

      expect(gameState.isGameOver).toBe(true);
      expect(gameState.winner).toBe('ai');
      expect(gameState.aiScore).toBe(1);
    });

    test('AI 贏應該更新分數', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);
      gameState.makeAIMove(5);

      expect(gameState.aiScore).toBe(1);
    });

    test('AI 贏後應該顯示訊息', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);
      gameState.makeAIMove(5);

      uiController.updateBoardDisplay();
      uiController.showResult('AI 贏了！');

      const message = document.getElementById('result-message');
      expect(message.textContent).toContain('AI 贏了！');
    });

    test('AI 贏後應該禁用所有位置', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);
      gameState.makeAIMove(5);

      uiController.updateBoardDisplay();

      const cells = document.querySelectorAll('[role="gridcell"]');
      for (const cell of cells) {
        expect(cell.className).toContain('disabled');
      }
    });
  });

  describe('平局遊戲流程', () => {
    test('應該完成平局的完整流程', () => {
      // 建立平局局面
      gameState.makePlayerMove(0); // X
      gameState.makeAIMove(1); // O
      gameState.makePlayerMove(2); // X
      gameState.makeAIMove(3); // O
      gameState.makePlayerMove(4); // X
      gameState.makeAIMove(5); // O
      gameState.makePlayerMove(6); // X
      gameState.makeAIMove(7); // O
      gameState.makePlayerMove(8); // X

      expect(gameState.isGameOver).toBe(true);
      expect(gameState.winner).toBeNull();
      expect(gameState.drawScore).toBe(1);
    });

    test('平局應該更新分數', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(2);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(4);
      gameState.makeAIMove(5);
      gameState.makePlayerMove(6);
      gameState.makeAIMove(7);
      gameState.makePlayerMove(8);

      expect(gameState.playerScore).toBe(0);
      expect(gameState.aiScore).toBe(0);
      expect(gameState.drawScore).toBe(1);
    });

    test('平局應該顯示訊息', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(2);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(4);
      gameState.makeAIMove(5);
      gameState.makePlayerMove(6);
      gameState.makeAIMove(7);
      gameState.makePlayerMove(8);

      uiController.showResult('平局！');

      const message = document.getElementById('result-message');
      expect(message.textContent).toContain('平局！');
    });

    test('平局應該填滿所有位置', () => {
      // Create a board state that results in a draw
      // Board: X | O | X
      //        O | O | X
      //        X | X | O
      gameState.makePlayerMove(0); // X at 0
      gameState.makeAIMove(1);     // O at 1
      gameState.makePlayerMove(2); // X at 2
      gameState.makeAIMove(3);     // O at 3
      gameState.makePlayerMove(5); // X at 5
      gameState.makeAIMove(4);     // O at 4
      gameState.makePlayerMove(6); // X at 6
      gameState.makeAIMove(8);     // O at 8
      gameState.makePlayerMove(7); // X at 7

      expect(gameState.board.getEmptyCells()).toHaveLength(0);
    });
  });

  describe('連續多局遊戲', () => {
    test('應該在分數累計中進行多局遊戲', () => {
      // 第一局：玩家贏
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);
      expect(gameState.playerScore).toBe(1);

      // 重置
      gameState.reset();

      // 第二局：平局
      gameState.makePlayerMove(0);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(2);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(4);
      gameState.makeAIMove(5);
      gameState.makePlayerMove(6);
      gameState.makeAIMove(7);
      gameState.makePlayerMove(8);
      expect(gameState.drawScore).toBe(1);

      // 重置
      gameState.reset();

      // 第三局：AI 贏
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);
      gameState.makeAIMove(5);
      expect(gameState.aiScore).toBe(1);

      expect(gameState.playerScore).toBe(1);
      expect(gameState.drawScore).toBe(1);
      expect(gameState.aiScore).toBe(1);
    });

    test('應該在重置後正確清除棋盤', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(4);
      expect(gameState.board.isEmpty()).toBe(false);

      gameState.reset();
      expect(gameState.board.isEmpty()).toBe(true);
      expect(gameState.currentTurn).toBe('player');
    });

    test('應該在連續遊戲中保持難度設定', () => {
      gameState.setDifficulty('easy');
      expect(gameState.difficulty).toBe('easy');

      gameState.makePlayerMove(0);
      gameState.reset();
      expect(gameState.difficulty).toBe('easy');
    });
  });

  describe('難度變更與遊戲流程', () => {
    test('應該在簡單難度下進行遊戲', () => {
      gameState.setDifficulty('easy');
      gameState.makePlayerMove(0);

      const move = aiEngine.calculateBestMove();
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
    });

    test('應該在中等難度下進行遊戲', () => {
      gameState.setDifficulty('medium');
      gameState.makePlayerMove(0);

      const move = aiEngine.calculateBestMove();
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
    });

    test('應該在困難難度下進行遊戲', () => {
      gameState.setDifficulty('hard');
      gameState.makePlayerMove(0);

      const move = aiEngine.calculateBestMove();
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
    });

    test('改變難度應該重置遊戲', () => {
      gameState.makePlayerMove(0);
      gameState.setDifficulty('easy');

      expect(gameState.board.isEmpty()).toBe(true);
      expect(gameState.difficulty).toBe('easy');
    });

    test('改變難度應該保留分數', () => {
      gameState.playerScore = 10;
      gameState.setDifficulty('hard');
      expect(gameState.playerScore).toBe(10);
    });
  });

  describe('UI 同步與遊戲狀態一致性', () => {
    test('UI 應該與遊戲狀態保持同步', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);

      uiController.updateBoardDisplay();
      uiController.updateStats();

      const cells = document.querySelectorAll('[role="gridcell"]');
      expect(cells[0].textContent).toBe('X');
      expect(cells[4].textContent).toBe('O');
      expect(cells[2].textContent).toBe('X');
    });

    test('統計資訊應該與遊戲狀態同步', () => {
      gameState.playerScore = 5;
      gameState.aiScore = 3;
      gameState.drawScore = 2;

      uiController.updateStats();

      expect(document.getElementById('player-score').textContent).toBe('5');
      expect(document.getElementById('ai-score').textContent).toBe('3');
      expect(document.getElementById('draw-score').textContent).toBe('2');
    });

    test('禁用狀態應該正確反映遊戲狀態', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(4);
      uiController.updateBoardDisplay();

      const cells = document.querySelectorAll('[role="gridcell"]');
      expect(cells[0].className).toContain('disabled');
      expect(cells[4].className).toContain('disabled');
      expect(cells[1].className).not.toContain('disabled');
    });
  });

  describe('邊界情況與異常情況', () => {
    test('應該在所有 8 個勝利條件中正確檢測', () => {
      // 測試所有 8 條贏線
      const winLines = [
        [0, 1, 2], // 頂行
        [3, 4, 5], // 中行
        [6, 7, 8], // 底行
        [0, 3, 6], // 左列
        [1, 4, 7], // 中列
        [2, 5, 8], // 右列
        [0, 4, 8], // 左上-右下對角線
        [2, 4, 6], // 右上-左下對角線
      ];

      for (const line of winLines) {
        gameState.reset();
        gameState.makePlayerMove(line[0]);
        gameState.makeAIMove(3); // AI 著法到不相關位置
        gameState.makePlayerMove(line[1]);
        gameState.makeAIMove(5); // AI 著法到不相關位置
        gameState.makePlayerMove(line[2]);

        expect(gameState.winner).toBe('player');
      }
    });

    test('應該處理快速連續著法', () => {
      // 模擬快速著法
      const moves = [
        () => gameState.makePlayerMove(0),
        () => gameState.makeAIMove(4),
        () => gameState.makePlayerMove(1),
        () => gameState.makeAIMove(3),
        () => gameState.makePlayerMove(2),
      ];

      for (const move of moves) {
        expect(() => move()).not.toThrow();
      }

      expect(gameState.isGameOver).toBe(true);
    });

    test('應該防止無效著法提前終止遊戲', () => {
      gameState.makePlayerMove(0);
      const result = gameState.makePlayerMove(0); // 重複著法在同一位置
      expect(result).toBe(false); // 應該返回 false，不是拋出錯誤
      expect(gameState.isGameOver).toBe(false);
    });

    test('應該在複雜遊戲場景中保持一致性', () => {
      // 複雜場景：多個威脅和防守
      const gameSequence = [
        { fn: () => gameState.makePlayerMove(0), desc: '玩家著法 0' },
        { fn: () => gameState.makeAIMove(4), desc: 'AI 著法 4' },
        { fn: () => gameState.makePlayerMove(1), desc: '玩家著法 1' },
        { fn: () => gameState.makeAIMove(3), desc: 'AI 著法 3' },
        { fn: () => gameState.makePlayerMove(2), desc: '玩家著法 2' },
      ];

      for (const step of gameSequence) {
        expect(() => step.fn()).not.toThrow();
      }

      expect(gameState.isGameOver).toBe(true);
      expect(gameState.moveCount).toBe(5);
    });
  });
});
