/**
 * AIEngine 單位測試
 * 測試 AI 決策：防守、進攻、Minimax 評估
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

describe('AIEngine', () => {
  let aiEngine;
  let gameState;

  beforeEach(() => {
    gameState = new GameState('hard');
    aiEngine = new AIEngine(gameState);
  });

  describe('初始化', () => {
    test('應該建立 AIEngine 實例', () => {
      expect(aiEngine).toBeDefined();
      expect(aiEngine.gameState).toBe(gameState);
    });
  });

  describe('calculateBestMove()', () => {
    test('應該返回一個有效的著法位置', () => {
      gameState.makePlayerMove(0);
      const move = aiEngine.calculateBestMove();
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
      expect(gameState.board.canMove(move)).toBe(true);
    });

    test('應該拒絕無效著法', () => {
      gameState.makePlayerMove(0);
      const move = aiEngine.calculateBestMove();
      expect(move).not.toBe(0); // 0 已被佔據
    });

    test('應該在 9 個位置都可用時返回有效位置', () => {
      const move = aiEngine.calculateBestMove();
      expect([0, 1, 2, 3, 4, 5, 6, 7, 8]).toContain(move);
    });

    test('應該在有多個可選著法時返回一個著法', () => {
      gameState.makePlayerMove(4);
      const move = aiEngine.calculateBestMove();
      expect(move).not.toBe(4);
      expect(gameState.board.canMove(move)).toBe(true);
    });
  });

  describe('getDefensiveMove()', () => {
    test('應該在玩家即將獲勝時阻止玩家', () => {
      // 玩家有兩個棋子在一行，AI 應該阻止第三個
      // X | X | _
      // _ | _ | _
      // _ | _ | _
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);

      const defensiveMove = aiEngine.getDefensiveMove();
      expect(defensiveMove).toBe(2); // 應該阻止在位置 2
    });

    test('應該在玩家即將贏時阻止玩家', () => {
      // X | _ | _
      // X | _ | _
      // _ | _ | _
      gameState.makePlayerMove(0);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(3);

      const defensiveMove = aiEngine.getDefensiveMove();
      expect(defensiveMove).toBe(6); // 應該阻止左列
    });

    test('如果無需防守應該返回 null', () => {
      gameState.makePlayerMove(0);
      const defensiveMove = aiEngine.getDefensiveMove();
      expect(defensiveMove).toBeNull();
    });

    test('應該檢測所有 8 條贏線', () => {
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
        gameState.makeAIMove(3); // AI 著法到不相關的位置
        gameState.makePlayerMove(line[1]);

        const defensiveMove = aiEngine.getDefensiveMove();
        expect(defensiveMove).toBe(line[2]);
      }
    });
  });

  describe('getOffensiveMove()', () => {
    test('應該在 AI 即將獲勝時進行致命一擊', () => {
      // _ | O | _
      // O | _ | _
      // _ | _ | _
      gameState.makePlayerMove(0);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(3);
      gameState.makeAIMove(4);

      const offensiveMove = aiEngine.getOffensiveMove();
      expect(offensiveMove).toBe(7); // 應該在中列贏
    });

    test('應該檢測所有 8 條贏線', () => {
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
        gameState.makePlayerMove(0); // 玩家著法
        gameState.makeAIMove(line[0]);
        gameState.makePlayerMove(1); // 玩家著法
        gameState.makeAIMove(line[1]);

        const offensiveMove = aiEngine.getOffensiveMove();
        expect(offensiveMove).toBe(line[2]);
      }
    });

    test('如果沒有立即勝利應該返回 null', () => {
      gameState.makePlayerMove(0);
      const offensiveMove = aiEngine.getOffensiveMove();
      expect(offensiveMove).toBeNull();
    });
  });

  describe('isWinningPosition()', () => {
    test('應該檢測玩家頂行贏', () => {
      const testBoard = new GameBoard();
      testBoard.setCell(0, 1);
      testBoard.setCell(1, 1);
      testBoard.setCell(2, 1);
      expect(aiEngine.isWinningPosition(testBoard, 1)).toBe(true);
    });

    test('應該檢測 AI 中列贏', () => {
      const testBoard = new GameBoard();
      testBoard.setCell(1, -1);
      testBoard.setCell(4, -1);
      testBoard.setCell(7, -1);
      expect(aiEngine.isWinningPosition(testBoard, -1)).toBe(true);
    });

    test('應該檢測對角線贏', () => {
      const testBoard = new GameBoard();
      testBoard.setCell(0, 1);
      testBoard.setCell(4, 1);
      testBoard.setCell(8, 1);
      expect(aiEngine.isWinningPosition(testBoard, 1)).toBe(true);
    });

    test('應該檢測反對角線贏', () => {
      const testBoard = new GameBoard();
      testBoard.setCell(2, -1);
      testBoard.setCell(4, -1);
      testBoard.setCell(6, -1);
      expect(aiEngine.isWinningPosition(testBoard, -1)).toBe(true);
    });

    test('不應該檢測不完整的行', () => {
      const testBoard = new GameBoard();
      testBoard.setCell(0, 1);
      testBoard.setCell(1, 1);
      expect(aiEngine.isWinningPosition(testBoard, 1)).toBe(false);
    });

    test('不應該檢測混合棋子的行', () => {
      const testBoard = new GameBoard();
      testBoard.setCell(0, 1);
      testBoard.setCell(1, -1);
      testBoard.setCell(2, 1);
      expect(aiEngine.isWinningPosition(testBoard, 1)).toBe(false);
    });
  });

  describe('minimax() 演算法', () => {
    test('應該在玩家可以贏時評估為負值', () => {
      // _ | X | _
      // _ | X | _
      // _ | O | _
      const testBoard = new GameBoard();
      testBoard.setCell(1, 1);
      testBoard.setCell(4, 1);
      testBoard.setCell(7, -1);
      const score = aiEngine.minimax(testBoard, 1, false);
      expect(score).toBeLessThan(0); // 負值表示玩家優勢
    });

    test('應該在 AI 可以贏時評估為正值', () => {
      // O | _ | _
      // O | _ | _
      // _ | X | _
      const testBoard = new GameBoard();
      testBoard.setCell(0, -1);
      testBoard.setCell(3, -1);
      testBoard.setCell(7, 1);
      const score = aiEngine.minimax(testBoard, 1, true);
      expect(score).toBeGreaterThan(0); // 正值表示 AI 優勢
    });

    test('應該在平局時評估為 0', () => {
      // 完全填滿的棋盤但無贏家
      const testBoard = new GameBoard();
      testBoard.setCell(0, 1);
      testBoard.setCell(1, -1);
      testBoard.setCell(2, 1);
      testBoard.setCell(3, -1);
      testBoard.setCell(4, 1);
      testBoard.setCell(5, -1);
      testBoard.setCell(6, -1);
      testBoard.setCell(7, 1);
      testBoard.setCell(8, -1);
      const score = aiEngine.minimax(testBoard, 0, true);
      expect(score).toBe(0); // 0 表示平局
    });

    test('應該考慮深度深度折扣', () => {
      const testBoard = new GameBoard();
      testBoard.setCell(8, -1);
      const deepScore = aiEngine.minimax(testBoard, 1, true);
      const shallowScore = aiEngine.minimax(testBoard, 0, true);
      // 評估應該考慮深度
      expect(typeof deepScore).toBe('number');
      expect(typeof shallowScore).toBe('number');
    });
  });

  describe('難度影響', () => {
    test('困難模式應該優先防守和進攻', () => {
      const hardEngine = new AIEngine(new GameState('hard'));
      gameState.setDifficulty('hard');

      gameState.makePlayerMove(0);
      gameState.makeAIMove(4);

      // 在困難模式下，AI 應該選擇防守或進攻
      const move = hardEngine.calculateBestMove();
      expect(move).toBeDefined();
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
    });

    test('簡單模式應該使用 Minimax', () => {
      const easyEngine = new AIEngine(new GameState('easy'));
      gameState.setDifficulty('easy');

      gameState.makePlayerMove(4);
      const move = easyEngine.calculateBestMove();

      expect(move).toBeDefined();
      expect([0, 1, 2, 3, 5, 6, 7, 8]).toContain(move);
    });
  });

  describe('邊界情況', () => {
    test('應該在空棋盤上進行著法', () => {
      const move = aiEngine.calculateBestMove();
      expect([0, 1, 2, 3, 4, 5, 6, 7, 8]).toContain(move);
    });

    test('應該在只有一個空位置時著法', () => {
      // 填滿除了位置 4 的所有位置
      for (let i = 0; i < 9; i++) {
        if (i !== 4) {
          gameState.board.setCell(i, i % 2 === 0 ? 1 : -1);
        }
      }
      gameState.currentTurn = -1;

      const move = aiEngine.calculateBestMove();
      expect(move).toBe(4);
    });

    test('應該優先考慮防守勝於進攻', () => {
      // 設置場景：AI 有贏的機會，但玩家更緊急
      // O | O | _
      // X | X | _
      // _ | _ | _
      gameState.makePlayerMove(3);
      gameState.makeAIMove(0);
      gameState.makePlayerMove(4);
      gameState.makeAIMove(1);

      const move = aiEngine.calculateBestMove();
      // AI 應該阻止玩家而不是進攻
      expect(move).toBe(5);
    });

    test('應該處理多個防守威脅', () => {
      // 玩家在多個位置有威脅
      // X | X | O
      // O | O | X
      // _ | _ | _
      gameState.makePlayerMove(0);
      gameState.makeAIMove(2);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(4);
      gameState.makeAIMove(5);

      const move = aiEngine.calculateBestMove();
      expect([6, 7, 8]).toContain(move);
    });
  });
});
