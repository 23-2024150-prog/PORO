let score = 0;
let combo = 0;
let hp = 100;
let gameRunning = false;
let selectedSong = null;
let selectedDifficulty = null;

// DOM要素の取得
const scoreDisplay = document.getElementById('score');
const comboDisplay = document.getElementById('combo');
const hpDisplay = document.getElementById('hp');
const songNameDisplay = document.getElementById('songName');
const noteLane = document.getElementById('noteLane');

// 楽曲データ
const songs = {
    'Tell Your World': {
        easy: { notes: 50, bpm: 120 },
        normal: { notes: 80, bpm: 120 }
    },
    'Hare Hare Yukai': {
        normal: { notes: 100, bpm: 140 },
        hard: { notes: 150, bpm: 140 }
    },
    'World is Mine': {
        hard: { notes: 120, bpm: 160 },
        expert: { notes: 200, bpm: 160 }
    },
    'Senbonzakura': {
        expert: { notes: 250, bpm: 200 }
    }
};

function selectSong(songName, difficulty) {
    selectedSong = songName;
    selectedDifficulty = difficulty;
    songNameDisplay.textContent = `${songName} - ${difficulty.toUpperCase()}`;
    alert(`楽曲選択完了: ${songName} (${difficulty.toUpperCase()})`);
}

function startGame() {
    if (!selectedSong) {
        alert('楽曲を選択してください！');
        return;
    }

    gameRunning = true;
    noteLane.innerHTML = '';
    combo = 0;
    updateDisplay();

    const songData = songs[selectedSong][selectedDifficulty];
    const noteCount = songData.notes;

    // ノーツを生成
    for (let i = 0; i < noteCount; i++) {
        setTimeout(() => {
            createNote();
        }, i * 300);
    }

    // ゲーム終了
    setTimeout(() => {
        gameRunning = false;
        endGame();
    }, noteCount * 300 + 3000);
}

function createNote() {
    if (!gameRunning) return;

    const note = document.createElement('div');
    note.className = 'note';
    note.style.left = Math.random() * 250 + 'px';
    
    noteLane.appendChild(note);

    note.addEventListener('click', () => {
        if (gameRunning) {
            hitNote(note);
        }
    });

    // ノーツが画面を通過したら削除
    setTimeout(() => {
        if (note.parentNode) {
            noteLane.removeChild(note);
            if (gameRunning) {
                missNote();
            }
        }
    }, 3000);
}

function hitNote(noteElement) {
    combo++;
    score += 100 * (1 + combo / 10);
    
    // ノーツの削除
    if (noteElement.parentNode) {
        noteElement.parentNode.removeChild(noteElement);
    }
    
    // 効果
    createEffect('HIT!', 'good');
    updateDisplay();
}

function missNote() {
    combo = 0;
    hp -= 5;
    
    if (hp <= 0) {
        hp = 0;
        gameRunning = false;
        endGame();
    }
    
    createEffect('MISS!', 'bad');
    updateDisplay();
}

function createEffect(text, type) {
    const effect = document.createElement('div');
    effect.style.position = 'absolute';
    effect.style.top = '50%';
    effect.style.left = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.fontSize = '2em';
    effect.style.fontWeight = 'bold';
    effect.style.color = type === 'good' ? '#00ff88' : '#ff4444';
    effect.style.pointerEvents = 'none';
    effect.textContent = text;
    effect.style.animation = 'fadeUp 1s ease-out';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeUp {
            from {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            to {
                opacity: 0;
                transform: translate(-50%, -150%) scale(1.5);
            }
        }
    `;
    document.head.appendChild(style);
    
    noteLane.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

function updateDisplay() {
    scoreDisplay.textContent = Math.floor(score);
    comboDisplay.textContent = combo;
    hpDisplay.textContent = Math.max(0, hp);
}

function endGame() {
    gameRunning = false;
    const rank = getRank();
    alert(`ゲーム終了！\n\nスコア: ${Math.floor(score)}\nコンボ: ${combo}\nランク: ${rank}`);
}

function getRank() {
    const finalScore = Math.floor(score);
    if (finalScore >= 50000) return 'S';
    if (finalScore >= 40000) return 'A';
    if (finalScore >= 30000) return 'B';
    if (finalScore >= 20000) return 'C';
    return 'D';
}

function resetGame() {
    score = 0;
    combo = 0;
    hp = 100;
    gameRunning = false;
    selectedSong = null;
    selectedDifficulty = null;
    noteLane.innerHTML = '';
    songNameDisplay.textContent = '楽曲を選択してください';
    updateDisplay();
}

// キーボード操作
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        const notes = document.querySelectorAll('.note');
        if (notes.length > 0) {
            hitNote(notes[0]);
        }
    }
});