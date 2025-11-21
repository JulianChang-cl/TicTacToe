/**
 * main.js - 應用程式入點
 * 初始化遊戲引擎、UI 控制器、事件系統
 */

// 導入 CSS
import '../styles/game.css';

// 導入所有必要的模組
import './game-board.js';
import './difficulty.js';
import './game-state.js';
import './ai-engine.js';
import './ui-controller.js';

// 應用程式初始化
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('🎮 TicTacToe 應用程式初始化...');

    // 從 window 取得已載入的類別
    const { GameState, AIEngine, UIController, DifficultyLevel } = window;

    // 1. 初始化遊戲狀態
    const gameState = new GameState('medium');
    console.log('✓ 遊戲狀態初始化完成 (難度: 中等)');

    // 2. 初始化 AI 引擎
    const aiEngine = new AIEngine('medium', gameState.board);
    console.log('✓ AI 引擎初始化完成');

    // 3. 初始化 UI 控制器
    const uiController = new UIController(gameState, aiEngine);
    uiController.init();
    console.log('✓ UI 控制器初始化完成');

    // 4. 暴露全域引用用於除錯
    window.game = {
      gameState,
      aiEngine,
      uiController,
      getStatus() {
        return {
          board: gameState.getBoardState(),
          currentTurn: gameState.currentTurn,
          difficulty: gameState.difficulty,
          isGameOver: gameState.isGameOver,
          winner: gameState.winner,
          moveCount: gameState.moveCount,
          playerScore: gameState.playerScore,
          aiScore: gameState.aiScore,
          drawScore: gameState.drawScore,
        };
      },
      reset() {
        gameState.reset();
        uiController.updateBoardDisplay();
        uiController.hideResult();
        console.log('遊戲已重置');
      },
      setDifficulty(difficulty) {
        if (!DifficultyLevel.isValid(difficulty)) {
          console.error(`無效難度: ${difficulty}`);
          return;
        }
        uiController.setDifficulty(difficulty);
        this.reset();
        console.log(`難度已更改為: ${difficulty}`);
      },
    };

    console.log('✅ 應用程式初始化完成！');
    console.log('💡 提示: 在控制台使用 game.getStatus() 查看遊戲狀態');
    console.log('💡 提示: 在控制台使用 game.setDifficulty("easy"|"medium"|"hard") 改變難度');
    console.log('💡 提示: 在控制台使用 game.reset() 重新開始遊戲');
  } catch (error) {
    console.error('❌ 應用程式初始化失敗:', error);
    document.body.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: #667eea;
        color: white;
        font-size: 18px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
      ">
        <div style="text-align: center;">
          <h1>❌ 應用程式載入失敗</h1>
          <p>${error.message}</p>
          <p style="font-size: 14px; color: rgba(255,255,255,0.7); margin-top: 20px;">
            請查閱瀏覽器控制台了解詳細資訊
          </p>
        </div>
      </div>
    `;
  }
});

// 全域錯誤處理
window.addEventListener('error', (event) => {
  console.error('❌ 全域錯誤:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ 未處理的 Promise 拒絕:', event.reason);
});
