// Глобальные переменные
let currentBet = 0;
let historyList = [];
let gameState = {
    crash: { isRunning: false, multiplier: 1 },
    ladder: { currentStep: 0, isPlaying: false },
    minesweeper: { revealed: [], mines: [], isPlaying: false, winCount: 0 }
};

// Скины CS2 с статреками
const CS2_SKINS = [
    { name: 'Dragon Lore Souvenir', weapon: 'AWP', rarity: 'Covert', price: 50000, image: '🔫' },
    { name: 'Fade', weapon: 'M4A1-S', rarity: 'Covert', price: 800, image: '🔫' },
    { name: 'Phantom Disruptor', weapon: 'Phantom', rarity: 'Restricted', price: 400, image: '🔫' },
    { name: 'Oni Taiji', weapon: 'Famas', rarity: 'Restricted', price: 300, image: '🔫' },
    { name: 'Deagle Crimson Web', weapon: 'Deagle', rarity: 'Classified', price: 600, image: '🔫' },
    { name: 'Knife Doppler', weapon: 'Knife', rarity: 'Covert', price: 3000, image: '🔪' },
    { name: 'AK-47 Neon Rider', weapon: 'AK-47', rarity: 'Classified', price: 500, image: '🔫' },
    { name: 'USP-S Kill Confirmed', weapon: 'USP-S', rarity: 'Restricted', price: 150, image: '🔫' },
    { name: 'M249 Nebula Dragon', weapon: 'M249', rarity: 'Covert', price: 800, image: '🔫' },
    { name: 'Glock-18 Wasteland Rebel', weapon: 'Glock-18', rarity: 'Restricted', price: 200, image: '🔫' }
];

// Качество оружия
const WEAPON_CONDITIONS = [
    { name: 'Factory New', shortName: 'FN', multiplier: 1.5, color: '#10b981' },
    { name: 'Minimal Wear', shortName: 'MW', multiplier: 1.3, color: '#3b82f6' },
    { name: 'Field Tested', shortName: 'FT', multiplier: 1.0, color: '#f59e0b' },
    { name: 'Well-Worn', shortName: 'WW', multiplier: 0.8, color: '#ef4444' },
    { name: 'Battle Scarred', shortName: 'BS', multiplier: 0.5, color: '#7c3aed' }
];

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadHistory();
});

function initializeEventListeners() {
    // Режимы
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', switchMode);
    });

    // Ставки
    document.getElementById('betInput').addEventListener('change', updateBet);
    document.getElementById('upgraderBetInput').addEventListener('change', updateUpgraderBet);
    document.getElementById('crashBetInput').addEventListener('change', updateCrashBet);
    document.getElementById('ladderBetInput').addEventListener('change', updateLadderBet);
    document.getElementById('minesweeperBetInput').addEventListener('change', updateMinesweeperBet);
}

// ============ РЕЖИМЫ ============
function switchMode(e) {
    const mode = e.target.getAttribute('data-mode');
    
    // Скрыть все режимы
    document.querySelectorAll('.mode-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Убрать активный класс с кнопок
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Показать выбранный режим
    document.getElementById(mode).classList.add('active');
    e.target.classList.add('active');
}

// ============ CASE BATTLE ============
function setBet(amount) {
    currentBet = amount;
    document.getElementById('betInput').value = amount;
    document.getElementById('currentBet').textContent = amount;
}

function updateBet() {
    const value = parseInt(document.getElementById('betInput').value) || 0;
    currentBet = value;
    document.getElementById('currentBet').textContent = value;
}

function spinWheel() {
    if (currentBet <= 0) {
        alert('Установите ставку!');
        return;
    }

    const spinBtn = document.getElementById('spinBtn');
    const wheel = document.getElementById('caseWheel');
    const resultDiv = document.getElementById('result');

    spinBtn.disabled = true;
    wheel.classList.add('spinning');

    // Генерируем случайный результат
    const randomRotation = Math.random() * 360;
    const spin = Math.floor(Math.random() * 3000) + randomRotation;
    
    wheel.style.transform = `rotate(${spin}deg)`;

    setTimeout(() => {
        const itemIndex = Math.floor((spin % 360) / 45);
        const items = [
            { name: 'Синий', price: 50 },
            { name: 'Зелёный', price: 150 },
            { name: 'Розовый', price: 200 },
            { name: 'Жёлтый', price: 500 },
            { name: 'Оранжевый', price: 300 },
            { name: 'Фиолетовый', price: 1000 },
            { name: 'Серебро', price: 750 },
            { name: 'Бронза', price: 400 }
        ];

        const winner = items[itemIndex];
        const winAmount = winner.price;
        const profit = winAmount - currentBet;
        const isWin = profit > 0;

        // Выбираем случайный скин CS2
        const randomSkin = CS2_SKINS[Math.floor(Math.random() * CS2_SKINS.length)];
        const randomCondition = WEAPON_CONDITIONS[Math.floor(Math.random() * WEAPON_CONDITIONS.length)];

        // Показываем результат
        resultDiv.innerHTML = `
            <div>
                <strong>${randomSkin.name} | ${randomCondition.shortName}</strong>
                <p>Выпал: ${winner.name} (${winAmount}₽)</p>
                <p style="color: ${isWin ? '#10b981' : '#ef4444'}">
                    ${isWin ? '+' : ''}${profit}₽
                </p>
            </div>
        `;
        
        resultDiv.className = isWin ? 'result win' : 'result lose';

        // Добавляем в историю
        addToHistory({
            type: 'Case Battle',
            bet: currentBet,
            win: winAmount,
            profit: profit,
            skin: `${randomSkin.name} | ${randomCondition.shortName}`
        });

        wheel.classList.remove('spinning');
        spinBtn.disabled = false;
    }, 2000);
}

// ============ UPGRADER ============
function setUpgraderBet(amount) {
    const bet = amount;
    document.getElementById('upgraderBetInput').value = amount;
    document.getElementById('currentUpgraderBet').textContent = amount;
}

function updateUpgraderBet() {
    const value = parseInt(document.getElementById('upgraderBetInput').value) || 0;
    document.getElementById('currentUpgraderBet').textContent = value;
}

function spinUpgrader() {
    const upgraderBet = parseInt(document.getElementById('currentUpgraderBet').textContent) || 0;
    if (upgraderBet <= 0) {
        alert('Установите ставку!');
        return;
    }

    const spinBtn = document.getElementById('upgraderSpinBtn');
    const wheel = document.getElementById('upgraderWheel');
    const resultDiv = document.getElementById('upgraderResult');

    spinBtn.disabled = true;
    wheel.classList.add('spinning');

    const multipliers = [1.2, 1.5, 2.0, 3.0, 0.5, 5.0];
    const randomIndex = Math.floor(Math.random() * multipliers.length);
    const multiplier = multipliers[randomIndex];
    const winAmount = Math.round(upgraderBet * multiplier);
    const profit = winAmount - upgraderBet;
    const isWin = multiplier > 1;

    setTimeout(() => {
        const randomSkin = CS2_SKINS[Math.floor(Math.random() * CS2_SKINS.length)];
        const randomCondition = WEAPON_CONDITIONS[Math.floor(Math.random() * WEAPON_CONDITIONS.length)];

        resultDiv.innerHTML = `
            <div>
                <strong>${randomSkin.name} | ${randomCondition.shortName}</strong>
                <p>Множитель: x${multiplier}</p>
                <p>Выигрыш: ${winAmount}₽</p>
                <p style="color: ${isWin ? '#10b981' : '#ef4444'}">
                    ${isWin ? '+' : ''}${profit}₽
                </p>
            </div>
        `;

        resultDiv.className = isWin ? 'result win' : 'result lose';

        addToHistory({
            type: 'Upgrader',
            bet: upgraderBet,
            multiplier: multiplier,
            win: winAmount,
            profit: profit,
            skin: `${randomSkin.name} | ${randomCondition.shortName}`
        });

        wheel.classList.remove('spinning');
        spinBtn.disabled = false;
    }, 1500);
}

// ============ CRASH ============
function setCrashBet(amount) {
    document.getElementById('crashBetInput').value = amount;
    document.getElementById('currentCrashBet').textContent = amount;
}

function updateCrashBet() {
    const value = parseInt(document.getElementById('crashBetInput').value) || 0;
    document.getElementById('currentCrashBet').textContent = value;
}

function startCrash() {
    const crashBet = parseInt(document.getElementById('currentCrashBet').textContent) || 0;
    if (crashBet <= 0) {
        alert('Установите ставку!');
        return;
    }

    gameState.crash.isRunning = true;
    gameState.crash.multiplier = 1;
    document.getElementById('crashStartBtn').disabled = true;
    document.getElementById('crashCashOutBtn').disabled = false;
    document.getElementById('crashResult').innerHTML = '';

    const canvas = document.getElementById('crashCanvas');
    const ctx = canvas.getContext('2d');
    const crashPoint = Math.random() * 4 + 1.5;
    const startTime = Date.now();

    function drawCrash() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#60a5fa';
        ctx.font = '20px Arial';
        ctx.fillText(`Множитель: x${gameState.crash.multiplier.toFixed(2)}`, 10, 30);

        const elapsed = (Date.now() - startTime) / 1000;
        gameState.crash.multiplier = 1 + elapsed * 0.5;

        if (gameState.crash.multiplier >= crashPoint) {
            gameState.crash.isRunning = false;
            ctx.fillStyle = '#ef4444';
            ctx.fillText('CRASH!', 150, 100);
            document.getElementById('crashCashOutBtn').disabled = true;
            document.getElementById('crashResult').innerHTML = `
                <div class="lose">Граф упал на x${crashPoint.toFixed(2)} 😱<br>Вы проиграли ${crashBet}₽</div>
            `;
            document.getElementById('crashResult').className = 'crash-result lose';
            
            addToHistory({
                type: 'Crash',
                bet: crashBet,
                crashPoint: crashPoint,
                profit: -crashBet,
                skin: 'Crash Game'
            });
            return;
        }

        if (gameState.crash.isRunning) {
            requestAnimationFrame(drawCrash);
        }
    }

    drawCrash();
}

function crashCashOut() {
    if (!gameState.crash.isRunning) return;

    gameState.crash.isRunning = false;
    const crashBet = parseInt(document.getElementById('currentCrashBet').textContent) || 0;
    const winAmount = Math.round(crashBet * gameState.crash.multiplier);
    const profit = winAmount - crashBet;

    document.getElementById('crashCashOutBtn').disabled = true;
    document.getElementById('crashStartBtn').disabled = false;
    document.getElementById('crashResult').innerHTML = `
        <div class="win">Успешно вышли на x${gameState.crash.multiplier.toFixed(2)}!<br>Выигрыш: ${winAmount}₽ (+${profit}₽)</div>
    `;
    document.getElementById('crashResult').className = 'crash-result win';

    addToHistory({
        type: 'Crash',
        bet: crashBet,
        multiplier: gameState.crash.multiplier,
        win: winAmount,
        profit: profit,
        skin: 'Crash Game'
    });
}

// ============ ЛЕСЕНКА ============
function setLadderBet(amount) {
    document.getElementById('ladderBetInput').value = amount;
    document.getElementById('currentLadderBet').textContent = amount;
}

function updateLadderBet() {
    const value = parseInt(document.getElementById('ladderBetInput').value) || 0;
    document.getElementById('currentLadderBet').textContent = value;
}

function ladderChoice(choice) {
    if (!gameState.ladder.isPlaying) return;

    const isCorrect = Math.random() > 0.5;

    if (isCorrect) {
        gameState.ladder.currentStep++;
        updateLadderSteps();

        if (gameState.ladder.currentStep >= 5) {
            endLadder(true);
        }
    } else {
        endLadder(false);
    }
}

function updateLadderSteps() {
    const steps = document.querySelectorAll('.ladder-step');
    steps.forEach((step, index) => {
        if (index < gameState.ladder.currentStep) {
            step.style.opacity = '0.5';
        } else if (index === gameState.ladder.currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function endLadder(isWin) {
    gameState.ladder.isPlaying = false;
    document.getElementById('ladderChoiceLeft').disabled = true;
    document.getElementById('ladderChoiceRight').disabled = true;

    const ladderBet = parseInt(document.getElementById('currentLadderBet').textContent) || 0;
    const multiplier = 1 + gameState.ladder.currentStep * 0.5;
    const winAmount = isWin ? Math.round(ladderBet * multiplier) : 0;
    const profit = winAmount - ladderBet;

    document.getElementById('ladderResult').innerHTML = `
        <div class="${isWin ? 'win' : 'lose'}">
            ${isWin ? `Поздравляем! Вы прошли ${gameState.ladder.currentStep} уровней!<br>Выигрыш: ${winAmount}₽` : 'Вы проиграли 😞'}
        </div>
    `;
    document.getElementById('ladderResult').className = `ladder-result ${isWin ? 'win' : 'lose'}`;

    addToHistory({
        type: 'Лесенка',
        bet: ladderBet,
        levels: gameState.ladder.currentStep,
        win: winAmount,
        profit: profit,
        skin: 'Ladder Game'
    });
}

// Инициализация лесенки при переключении
document.addEventListener('click', function(e) {
    if (e.target.getAttribute('data-mode') === 'ladder') {
        gameState.ladder.currentStep = 0;
        gameState.ladder.isPlaying = true;
        document.getElementById('ladderChoiceLeft').disabled = false;
        document.getElementById('ladderChoiceRight').disabled = false;
        document.getElementById('ladderResult').innerHTML = '';
        updateLadderSteps();
    }
});

// ============ САПЕР ============
function setMinesweeperBet(amount) {
    document.getElementById('minesweeperBetInput').value = amount;
    document.getElementById('currentMinesweeperBet').textContent = amount;
}

function updateMinesweeperBet() {
    const value = parseInt(document.getElementById('minesweeperBetInput').value) || 0;
    document.getElementById('currentMinesweeperBet').textContent = value;
}

function startMinesweeper() {
    const minesweeperBet = parseInt(document.getElementById('currentMinesweeperBet').textContent) || 0;
    if (minesweeperBet <= 0) {
        alert('Установите ставку!');
        return;
    }

    gameState.minesweeper.isPlaying = true;
    gameState.minesweeper.revealed = [];
    gameState.minesweeper.winCount = 0;
    gameState.minesweeper.mines = generateMines();

    document.getElementById('minesweeperStartBtn').disabled = true;
    document.getElementById('minesweeperCashOutBtn').disabled = false;
    document.getElementById('minesweeperResult').innerHTML = '';

    renderMinesweeperGrid();
}

function generateMines() {
    const mines = [];
    while (mines.length < 5) {
        const randomIndex = Math.floor(Math.random() * 25);
        if (!mines.includes(randomIndex)) {
            mines.push(randomIndex);
        }
    }
    return mines;
}

function renderMinesweeperGrid() {
    const grid = document.getElementById('minesweeperGrid');
    grid.innerHTML = '';

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        cell.onclick = () => revealCell(i);
        grid.appendChild(cell);
    }
}

function revealCell(index) {
    if (!gameState.minesweeper.isPlaying || gameState.minesweeper.revealed.includes(index)) {
        return;
    }

    gameState.minesweeper.revealed.push(index);
    const cell = document.querySelectorAll('.mine-cell')[index];

    if (gameState.minesweeper.mines.includes(index)) {
        // Бомба!
        cell.classList.add('mine', 'revealed');
        cell.textContent = '💣';
        endMinesweeper(false);
    } else {
        // Безопасная клетка
        cell.classList.add('safe', 'revealed');
        cell.textContent = '✓';
        gameState.minesweeper.winCount++;

        if (gameState.minesweeper.winCount >= 20) {
            endMinesweeper(true);
        }
    }
}

function minesweeperCashOut() {
    if (!gameState.minesweeper.isPlaying) return;
    endMinesweeper(true);
}

function endMinesweeper(isWin) {
    gameState.minesweeper.isPlaying = false;
    document.getElementById('minesweeperCashOutBtn').disabled = true;
    document.getElementById('minesweeperStartBtn').disabled = false;

    const minesweeperBet = parseInt(document.getElementById('currentMinesweeperBet').textContent) || 0;
    const multiplier = 1 + gameState.minesweeper.winCount * 0.1;
    const winAmount = isWin ? Math.round(minesweeperBet * multiplier) : 0;
    const profit = winAmount - minesweeperBet;

    document.getElementById('minesweeperResult').innerHTML = `
        <div class="${isWin ? 'win' : 'lose'}">
            ${isWin ? `Вы нашли ${gameState.minesweeper.winCount} безопасных клеток!<br>Выигрыш: ${winAmount}₽` : 'Вы наступили на бомбу! 💣'}
        </div>
    `;
    document.getElementById('minesweeperResult').className = `minesweeper-result ${isWin ? 'win' : 'lose'}`;

    // Раскрыть все оставшиеся клетки
    document.querySelectorAll('.mine-cell').forEach((cell, index) => {
        if (!cell.classList.contains('revealed')) {
            cell.classList.add('revealed');
            if (gameState.minesweeper.mines.includes(index)) {
                cell.classList.add('mine');
                cell.textContent = '💣';
            } else {
                cell.classList.add('safe');
                cell.textContent = '✓';
            }
        }
    });

    addToHistory({
        type: 'Сапер',
        bet: minesweeperBet,
        safeCells: gameState.minesweeper.winCount,
        win: winAmount,
        profit: profit,
        skin: 'Minesweeper Game'
    });
}

// ============ ИСТОРИЯ ============
function addToHistory(entry) {
    const historyItem = {
        timestamp: new Date().toLocaleTimeString(),
        ...entry
    };

    historyList.unshift(historyItem);
    if (historyList.length > 50) {
        historyList.pop();
    }

    updateHistoryDisplay();
    saveHistory();
}

function updateHistoryDisplay() {
    const historyPanel = document.getElementById('historyList');
    historyPanel.innerHTML = '';

    historyList.forEach((item, index) => {
        const historyElement = document.createElement('div');
        historyElement.className = 'history-item';

        let resultText = '';
        if (item.type === 'Case Battle') {
            resultText = `${item.skin}<br>Ставка: ${item.bet}₽ → Выигрыш: ${item.win}₽`;
        } else if (item.type === 'Upgrader') {
            resultText = `x${item.multiplier}<br>Ставка: ${item.bet}₽ → ${item.win}₽`;
        } else if (item.type === 'Crash') {
            resultText = `x${item.multiplier ? item.multiplier.toFixed(2) : 'CRASH!'}<br>Ставка: ${item.bet}₽`;
        } else if (item.type === 'Лесенка') {
            resultText = `Уровней: ${item.levels}<br>Ставка: ${item.bet}₽ → ${item.win}₽`;
        } else if (item.type === 'Сапер') {
            resultText = `Клеток: ${item.safeCells}<br>Ставка: ${item.bet}₽ → ${item.win}₽`;
        }

        const profitColor = item.profit > 0 ? '#10b981' : item.profit < 0 ? '#ef4444' : '#93c5fd';

        historyElement.innerHTML = `
            <div class="history-item-title">${item.type} ${item.timestamp}</div>
            <div class="history-item-bet">${resultText}</div>
            <div class="history-item-result" style="color: ${profitColor}">
                ${item.profit > 0 ? '+' : ''}${item.profit}₽
            </div>
        `;

        historyPanel.appendChild(historyElement);
    });

    if (historyList.length === 0) {
        historyPanel.innerHTML = '<p class="empty-history">История пуста</p>';
    }
}

function saveHistory() {
    localStorage.setItem('flashbattle_history', JSON.stringify(historyList));
}

function loadHistory() {
    const saved = localStorage.getItem('flashbattle_history');
    if (saved) {
        historyList = JSON.parse(saved);
        updateHistoryDisplay();
    }
}
