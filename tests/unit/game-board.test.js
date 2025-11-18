/**
 * GameBoard 單位測試
 * 測試棋盤操作：getCell, setCell, canMove, isEmpty, reset, getEmptyCells
 */

// 載入遊戲類別模組
// eslint-disable-next-line global-require
const GameBoard = require('../../src/scripts/game-board');

describe('GameBoard', () => {
  let board;

  beforeEach(() => {
    // 為每個測試建立新的棋盤實例
    board = new GameBoard();
  });

  describe('初始化', () => {
    test('應該建立一個有 9 個空位置的棋盤', () => {
      expect(board.cells).toHaveLength(9);
      expect(board.cells).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    test('所有位置應該是空的', () => {
      expect(board.isEmpty()).toBe(true);
    });
  });

  describe('getCell()', () => {
    test('應該取得空位置的值 (0)', () => {
      expect(board.getCell(0)).toBe(0);
      expect(board.getCell(4)).toBe(0);
      expect(board.getCell(8)).toBe(0);
    });

    test('應該拋出錯誤當索引無效 (< 0)', () => {
      expect(() => board.getCell(-1)).toThrow();
    });

    test('應該拋出錯誤當索引無效 (> 8)', () => {
      expect(() => board.getCell(9)).toThrow();
    });

    test('應該拋出錯誤當索引不是整數', () => {
      expect(() => board.getCell(1.5)).toThrow();
    });
  });

  describe('setCell()', () => {
    test('應該在空位置放置玩家棋子 (1)', () => {
      board.setCell(0, 1);
      expect(board.getCell(0)).toBe(1);
    });

    test('應該在空位置放置 AI 棋子 (-1)', () => {
      board.setCell(4, -1);
      expect(board.getCell(4)).toBe(-1);
    });

    test('應該拋出錯誤當嘗試在已佔據的位置放置', () => {
      board.setCell(0, 1);
      expect(() => board.setCell(0, -1)).toThrow();
    });

    test('應該拋出錯誤當值無效', () => {
      expect(() => board.setCell(0, 2)).toThrow();
      expect(() => board.setCell(0, 0)).toThrow();
    });

    test('應該拋出錯誤當索引無效', () => {
      expect(() => board.setCell(9, 1)).toThrow();
      expect(() => board.setCell(-1, 1)).toThrow();
    });
  });

  describe('canMove()', () => {
    test('應該允許在空位置著法', () => {
      expect(board.canMove(0)).toBe(true);
      expect(board.canMove(4)).toBe(true);
      expect(board.canMove(8)).toBe(true);
    });

    test('應該拒絕在已佔據的位置著法', () => {
      board.setCell(0, 1);
      expect(board.canMove(0)).toBe(false);
    });

    test('應該檢查所有 9 個位置', () => {
      // 填滿所有位置
      board.setCell(0, 1);
      board.setCell(1, -1);
      board.setCell(2, 1);
      board.setCell(3, -1);
      board.setCell(4, 1);
      board.setCell(5, -1);
      board.setCell(6, 1);
      board.setCell(7, -1);
      board.setCell(8, 1);

      // 所有位置都應該不可著
      for (let i = 0; i < 9; i++) {
        expect(board.canMove(i)).toBe(false);
      }
    });
  });

  describe('isEmpty()', () => {
    test('新建立的棋盤應該有空位', () => {
      expect(board.isEmpty()).toBe(true);
    });

    test('放置一個棋子後應該還有空位', () => {
      board.setCell(0, 1);
      expect(board.isEmpty()).toBe(true);
    });

    test('所有位置都填滿後應該沒有空位', () => {
      for (let i = 0; i < 9; i++) {
        board.setCell(i, i % 2 === 0 ? 1 : -1);
      }
      expect(board.isEmpty()).toBe(false);
    });
  });

  describe('reset()', () => {
    test('應該清除所有棋子', () => {
      board.setCell(0, 1);
      board.setCell(1, -1);
      board.setCell(4, 1);

      board.reset();

      expect(board.cells).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(board.isEmpty()).toBe(true);
    });

    test('應該允許在重置後重新著法', () => {
      board.setCell(0, 1);
      board.reset();
      expect(() => board.setCell(0, 1)).not.toThrow();
    });
  });

  describe('getEmptyCells()', () => {
    test('應該在新棋盤上返回所有 9 個位置', () => {
      const empty = board.getEmptyCells();
      expect(empty).toHaveLength(9);
      expect(empty).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    test('應該在放置棋子後返回剩餘的空位置', () => {
      board.setCell(0, 1);
      board.setCell(4, -1);
      const empty = board.getEmptyCells();
      expect(empty).toHaveLength(7);
      expect(empty).not.toContain(0);
      expect(empty).not.toContain(4);
    });

    test('應該在棋盤滿時返回空陣列', () => {
      for (let i = 0; i < 9; i++) {
        board.setCell(i, i % 2 === 0 ? 1 : -1);
      }
      const empty = board.getEmptyCells();
      expect(empty).toHaveLength(0);
      expect(empty).toEqual([]);
    });
  });

  describe('getCellsCopy() / setCells()', () => {
    test('應該返回棋盤的獨立副本', () => {
      board.setCell(0, 1);
      board.setCell(4, -1);

      const copy = board.getCellsCopy();
      expect(copy).toEqual([1, 0, 0, 0, -1, 0, 0, 0, 0]);

      // 修改副本不應該影響原始棋盤
      copy[0] = 0;
      expect(board.getCell(0)).toBe(1);
    });

    test('應該能夠設置棋盤狀態', () => {
      const newState = [1, -1, 1, -1, 1, -1, 1, -1, 1];
      board.setCells(newState);

      expect(board.cells).toEqual(newState);
      for (let i = 0; i < 9; i++) {
        expect(board.getCell(i)).toBe(newState[i]);
      }
    });

    test('應該拋出錯誤當設置狀態長度不是 9', () => {
      expect(() => board.setCells([1, 2, 3])).toThrow();
      expect(() => board.setCells([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toThrow();
    });

    test('應該在設置狀態後建立獨立副本', () => {
      const originalState = [1, 0, 0, 0, 0, 0, 0, 0, 0];
      board.setCells(originalState);

      // 修改原始陣列不應該影響棋盤
      originalState[0] = 0;
      expect(board.getCell(0)).toBe(1);
    });
  });

  describe('邊界情況', () => {
    test('應該處理所有有效的索引 (0-8)', () => {
      const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      indices.forEach((i) => {
        expect(board.canMove(i)).toBe(true);
        board.setCell(i, i % 2 === 0 ? 1 : -1);
      });

      indices.forEach((i) => {
        expect(board.getCell(i)).toBe(i % 2 === 0 ? 1 : -1);
      });
    });

    test('應該在連續操作中正確維護狀態', () => {
      // 模擬遊戲過程
      board.setCell(0, 1); // 玩家
      board.setCell(4, -1); // AI
      board.setCell(1, 1); // 玩家
      board.setCell(2, -1); // AI

      expect(board.getEmptyCells()).toEqual([3, 5, 6, 7, 8]);
      expect(board.isEmpty()).toBe(false);

      board.reset();
      expect(board.isEmpty()).toBe(true);
      expect(board.getEmptyCells()).toHaveLength(9);
    });
  });
});
