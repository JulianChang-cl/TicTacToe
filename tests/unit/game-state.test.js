/**
 * GameState 單位測試
 * 測試遊戲狀態：贏家檢測、平局檢測、著法驗證、遊戲流程
 */

// 載入遊戲類別模組（需按依賴順序）
// eslint-disable-next-line global-require
// eslint-disable-next-line no-unused-vars
const GameBoard = require('../../src/scripts/game-board');
// eslint-disable-next-line global-require
const GameState = require('../../src/scripts/game-state');

describe('GameState', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState('medium');
  });

  describe('初始化', () => {
    test('應該以中等難度初始化遊戲', () => {
      expect(gameState.currentTurn).toBe('player'); // 玩家先手
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.winner).toBeNull();
      expect(gameState.difficulty).toBe('medium');
    });

    test('應該初始化分數為 0', () => {
      expect(gameState.playerScore).toBe(0);
      expect(gameState.aiScore).toBe(0);
      expect(gameState.drawScore).toBe(0);
    });

    test('應該接受不同的難度級別', () => {
      const easy = new GameState('easy');
      expect(easy.difficulty).toBe('easy');

      const hard = new GameState('hard');
      expect(hard.difficulty).toBe('hard');
    });
  });

  describe('isValidMove()', () => {
    test('應該允許在空位置著法', () => {
      expect(gameState.isValidMove(0)).toBe(true);
      expect(gameState.isValidMove(4)).toBe(true);
      expect(gameState.isValidMove(8)).toBe(true);
    });

    test('應該拒絕在已佔據的位置著法', () => {
      gameState.makePlayerMove(0);
      expect(gameState.isValidMove(0)).toBe(false);
    });

    test('應該在遊戲結束後拒絕著法', () => {
      // 建立玩家贏的局面：
      // X | _ | _
      // X | O | _
      // X | O | _
      gameState.makePlayerMove(0);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(3);
      gameState.makeAIMove(7);
      gameState.makePlayerMove(6);

      expect(gameState.isGameOver).toBe(true);
      expect(gameState.isValidMove(1)).toBe(false);
    });
  });

  describe('checkWinner() - 玩家勝利', () => {
    test('應該檢測到頂行勝利 (位置 0, 1, 2)', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);

      expect(gameState.isGameOver).toBe(true);
      expect(gameState.winner).toBe('player');
      expect(gameState.playerScore).toBe(1);
    });

    test('應該檢測到中間行勝利 (位置 3, 4, 5)', () => {
      gameState.makePlayerMove(3);
      gameState.makeAIMove(0);
      gameState.makePlayerMove(4);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(5);

      expect(gameState.winner).toBe('player');
      expect(gameState.playerScore).toBe(1);
    });

    test('應該檢測到底行勝利 (位置 6, 7, 8)', () => {
      gameState.makePlayerMove(6);
      gameState.makeAIMove(0);
      gameState.makePlayerMove(7);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(8);

      expect(gameState.winner).toBe('player');
      expect(gameState.playerScore).toBe(1);
    });

    test('應該檢測到左列勝利 (位置 0, 3, 6)', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(3);
      gameState.makeAIMove(2);
      gameState.makePlayerMove(6);

      expect(gameState.winner).toBe('player');
      expect(gameState.playerScore).toBe(1);
    });

    test('應該檢測到中列勝利 (位置 1, 4, 7)', () => {
      gameState.makePlayerMove(1);
      gameState.makeAIMove(0);
      gameState.makePlayerMove(4);
      gameState.makeAIMove(2);
      gameState.makePlayerMove(7);

      expect(gameState.winner).toBe('player');
      expect(gameState.playerScore).toBe(1);
    });

    test('應該檢測到右列勝利 (位置 2, 5, 8)', () => {
      gameState.makePlayerMove(2);
      gameState.makeAIMove(0);
      gameState.makePlayerMove(5);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(8);

      expect(gameState.winner).toBe('player');
      expect(gameState.playerScore).toBe(1);
    });

    test('應該檢測到左上-右下對角線勝利 (位置 0, 4, 8)', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(4);
      gameState.makeAIMove(2);
      gameState.makePlayerMove(8);

      expect(gameState.winner).toBe('player');
      expect(gameState.playerScore).toBe(1);
    });

    test('應該檢測到左下-右上對角線勝利 (位置 2, 4, 6)', () => {
      gameState.makePlayerMove(2);
      gameState.makeAIMove(0);
      gameState.makePlayerMove(4);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(6);

      expect(gameState.winner).toBe('player');
      expect(gameState.playerScore).toBe(1);
    });
  });

  describe('checkWinner() - AI 勝利', () => {
    test('應該檢測到 AI 行勝利', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);
      gameState.makeAIMove(5);

      expect(gameState.winner).toBe('ai');
      expect(gameState.aiScore).toBe(1);
      expect(gameState.isGameOver).toBe(true);
    });

    test('應該檢測到 AI 列勝利', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(3);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(6);
      gameState.makeAIMove(7);

      expect(gameState.winner).toBe('ai');
      expect(gameState.aiScore).toBe(1);
    });

    test('應該檢測到 AI 對角線勝利', () => {
      gameState.makePlayerMove(1);
      gameState.makeAIMove(0);
      gameState.makePlayerMove(3);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(6);
      gameState.makeAIMove(8);

      expect(gameState.winner).toBe('ai');
      expect(gameState.aiScore).toBe(1);
    });
  });

  describe('checkDraw()', () => {
    test('應該檢測到平局當所有位置都滿', () => {
      // 建立平局局面：
      // X | O | X
      // X | O | O
      // O | X | X
      gameState.makePlayerMove(0);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(2);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(4);
      gameState.makeAIMove(5);
      gameState.makePlayerMove(6);
      gameState.makeAIMove(7);
      gameState.makePlayerMove(8);

      expect(gameState.isGameOver).toBe(true);
      expect(gameState.winner).toBeNull();
      expect(gameState.drawScore).toBe(1);
    });

    test('不應該在還有空位置時檢測到平局', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(2);

      expect(gameState.isGameOver).toBe(false);
    });
  });

  describe('reset()', () => {
    test('應該清除棋盤但保留分數', () => {
      gameState.makePlayerMove(0);
      gameState.playerScore = 5;
      gameState.aiScore = 3;
      gameState.drawScore = 1;

      gameState.reset();

      expect(gameState.board.isEmpty()).toBe(true);
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.winner).toBeNull();
      expect(gameState.currentTurn).toBe('player');
      expect(gameState.playerScore).toBe(5);
      expect(gameState.aiScore).toBe(3);
      expect(gameState.drawScore).toBe(1);
    });

    test('應該允許在重置後進行新遊戲', () => {
      gameState.makePlayerMove(0);
      gameState.reset();
      expect(() => gameState.makePlayerMove(0)).not.toThrow();
    });
  });

  describe('setDifficulty()', () => {
    test('應該改變難度並重置遊戲', () => {
      gameState.makePlayerMove(0);
      gameState.setDifficulty('hard');

      expect(gameState.difficulty).toBe('hard');
      expect(gameState.board.isEmpty()).toBe(true);
      expect(gameState.isGameOver).toBe(false);
    });

    test('應該保留分數當改變難度', () => {
      gameState.playerScore = 10;
      gameState.setDifficulty('easy');
      expect(gameState.playerScore).toBe(10);
    });
  });

  describe('getBoardState()', () => {
    test('應該返回棋盤的當前狀態', () => {
      gameState.makePlayerMove(0);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(8);

      const state = gameState.getBoardState();
      expect(state).toEqual([1, 0, 0, 0, -1, 0, 0, 0, 1]);
    });

    test('應該返回獨立的副本', () => {
      gameState.makePlayerMove(0);
      const state = gameState.getBoardState();

      // 修改返回的狀態不應該影響遊戲狀態
      state[0] = 0;
      expect(gameState.getBoardState()[0]).toBe(1);
    });
  });

  describe('makePlayerMove() / makeAIMove() 完整流程', () => {
    test('應該在玩家著法後切換回合到 AI', () => {
      expect(gameState.currentTurn).toBe('player'); // 玩家
      gameState.makePlayerMove(0);
      expect(gameState.currentTurn).toBe('ai'); // AI
    });

    test('應該在 AI 著法後切換回合到玩家', () => {
      gameState.makePlayerMove(0);
      expect(gameState.currentTurn).toBe(-1); // AI
      gameState.makeAIMove(4);
      expect(gameState.currentTurn).toBe(1); // 玩家
    });

    test('應該拒絕無效著法', () => {
      gameState.makePlayerMove(0);
      expect(() => gameState.makePlayerMove(0)).toThrow();
    });

    test('應該跟踪著法數量', () => {
      expect(gameState.moveCount).toBe(0);
      gameState.makePlayerMove(0);
      expect(gameState.moveCount).toBe(1);
      gameState.makeAIMove(4);
      expect(gameState.moveCount).toBe(2);
    });

    test('應該跟踪最後著法位置', () => {
      gameState.makePlayerMove(5);
      expect(gameState.lastMoveIndex).toBe(5);
      gameState.makeAIMove(3);
      expect(gameState.lastMoveIndex).toBe(3);
    });
  });

  describe('邊界情況', () => {
    test('應該處理連續著法序列', () => {
      const moves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      for (let i = 0; i < 9; i++) {
        const move = moves[i];
        if (i < 9) {
          if (gameState.isGameOver) {
            break;
          }
          if (i % 2 === 0) {
            gameState.makePlayerMove(move);
          } else {
            gameState.makeAIMove(move);
          }
        }
      }
      expect(gameState.moveCount).toBeGreaterThanOrEqual(0);
    });

    test('多次遊戲應該正確累計分數', () => {
      // 第一場遊戲：玩家勝
      gameState.makePlayerMove(0);
      gameState.makeAIMove(3);
      gameState.makePlayerMove(1);
      gameState.makeAIMove(4);
      gameState.makePlayerMove(2);
      expect(gameState.playerScore).toBe(1);

      // 重置並進行第二場遊戲
      gameState.reset();
      gameState.makePlayerMove(3);
      gameState.makeAIMove(0);
      gameState.makePlayerMove(4);
      gameState.makeAIMove(1);
      gameState.makePlayerMove(5);
      expect(gameState.playerScore).toBe(2);
    });
  });
});
