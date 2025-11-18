/**
 * DifficultyLevel 類別 - 難度管理與策略定義
 * 定義 Easy/Medium/Hard 三個難度級別及其 AI 策略參數
 */
class DifficultyLevel {
  // 難度定義常數
  static LEVELS = {
    easy: 'easy',
    medium: 'medium',
    hard: 'hard',
  };

  /**
   * 取得指定難度的策略參數
   * @param {string} level - 難度等級
   * @returns {Object} 策略參數 {defense, offense, randomness}
   */
  static getStrategy(level) {
    const strategies = {
      easy: {
        defense: 0.5, // 50% 防守優先
        offense: 0.3, // 30% 攻擊優先
        randomness: 0.2, // 20% 隨機選擇
      },
      medium: {
        defense: 0.9, // 90% 防守優先
        offense: 0.95, // 95% 攻擊優先
        randomness: 0.05, // 5% 隨機選擇
      },
      hard: {
        defense: 1.0, // 100% 防守優先 (強制)
        offense: 1.0, // 100% 攻擊優先 (強制)
        randomness: 0.0, // 0% 隨機選擇
      },
    };

    if (!strategies[level]) {
      throw new Error(`無效的難度等級: ${level}`);
    }

    return strategies[level];
  }

  /**
   * 取得難度的顯示名稱
   * @param {string} level - 難度等級
   * @returns {string}
   */
  static getDisplayName(level) {
    const names = {
      easy: '簡單',
      medium: '中等',
      hard: '困難',
    };
    return names[level] || '未知';
  }

  /**
   * 取得難度的說明
   * @param {string} level - 難度等級
   * @returns {string}
   */
  static getDescription(level) {
    const descriptions = {
      easy: 'AI 經常犯錯，適合初學者',
      medium: 'AI 有適當競爭力，均衡遊戲體驗',
      hard: 'AI 最優演奏，極難戰勝',
    };
    return descriptions[level] || '';
  }

  /**
   * 檢查難度是否有效
   * @param {string} level - 難度等級
   * @returns {boolean}
   */
  static isValid(level) {
    return Object.values(DifficultyLevel.LEVELS).includes(level);
  }

  /**
   * 取得所有難度等級
   * @returns {Array<string>}
   */
  static getAllLevels() {
    return Object.values(DifficultyLevel.LEVELS);
  }

  /**
   * 計算基於難度的隨機決策概率
   * @param {string} level - 難度等級
   * @returns {number} 隨機決策的概率 (0-1)
   */
  static getRandomnessProbability(level) {
    const strategy = DifficultyLevel.getStrategy(level);
    return strategy.randomness;
  }

  /**
   * 根據難度決定是否執行防守策略
   * @param {string} level - 難度等級
   * @returns {boolean}
   */
  static shouldUseDeffense(level) {
    const strategy = DifficultyLevel.getStrategy(level);
    return Math.random() < strategy.defense;
  }

  /**
   * 根據難度決定是否執行攻擊策略
   * @param {string} level - 難度等級
   * @returns {boolean}
   */
  static shouldUseOffense(level) {
    const strategy = DifficultyLevel.getStrategy(level);
    return Math.random() < strategy.offense;
  }
}

// 導出 DifficultyLevel 類別
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DifficultyLevel;
}
