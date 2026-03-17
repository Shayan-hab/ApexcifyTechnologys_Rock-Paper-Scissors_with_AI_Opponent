const emojiMap = {
    'Rock': '✊',
    'Paper': '✋',
    'Scissors': '✌️',
    'None': '🤔',
    'AI_Ready': '🤖'
};

let isProcessing = false;

async function playGame(move) {
    if (isProcessing) return;
    isProcessing = true;
    
    // Optimistic UI update
    animateMoveStart(move);

    try {
        const response = await fetch('/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ move: move })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Slight delay for dramatic effect
        setTimeout(() => {
            updateUI(data);
            isProcessing = false;
        }, 500);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
        isProcessing = false;
    }
}

function animateMoveStart(userMove) {
    const userDisplay = document.getElementById('user-display');
    const aiDisplay = document.getElementById('ai-display');
    const resultText = document.getElementById('round-result');

    // Add animation classes
    userDisplay.classList.add('animating');
    aiDisplay.classList.add('animating');

    // Set intermediate state
    document.getElementById('user-emoji').innerText = emojiMap[userMove];
    document.getElementById('user-text').innerText = userMove;
    
    document.getElementById('ai-emoji').innerText = '💭';
    document.getElementById('ai-text').innerText = 'Thinking...';
    
    resultText.innerText = 'Vs';
    resultText.className = '';
}

function updateUI(data) {
    const userDisplay = document.getElementById('user-display');
    const aiDisplay = document.getElementById('ai-display');
    const resultText = document.getElementById('round-result');

    // Remove animation classes
    userDisplay.classList.remove('animating');
    aiDisplay.classList.remove('animating');

    // Update choices
    document.getElementById('user-emoji').innerText = emojiMap[data.user_move];
    document.getElementById('user-text').innerText = data.user_move;

    document.getElementById('ai-emoji').innerText = emojiMap[data.ai_move];
    document.getElementById('ai-text').innerText = data.ai_move;

    // Update Result Text and styling
    if (data.result === 'Win') {
        resultText.innerText = 'You Win!';
        resultText.className = 'win-text';
    } else if (data.result === 'Lose') {
        resultText.innerText = 'AI Wins!';
        resultText.className = 'lose-text';
    } else {
        resultText.innerText = 'Draw!';
        resultText.className = 'draw-text';
    }

    // Update Scoreboard
    document.getElementById('user-score-val').innerText = data.stats.wins;
    document.getElementById('ai-score-val').innerText = data.stats.losses;

    // Update Statistics Panel
    document.getElementById('stat-rounds').innerText = data.stats.total_rounds;
    document.getElementById('stat-draws').innerText = data.stats.draws;
    document.getElementById('stat-winrate').innerText = data.stats.win_rate;
    document.getElementById('stat-frequent').innerText = data.stats.most_frequent !== 'None' ? data.stats.most_frequent : '-';
}

async function resetGame() {
    if(!confirm('Are you sure you want to reset all game stats?')) return;

    try {
        const response = await fetch('/reset', {
            method: 'POST'
        });

        if (response.ok) {
            // Reset UI
            document.getElementById('user-score-val').innerText = '0';
            document.getElementById('ai-score-val').innerText = '0';
            
            document.getElementById('user-emoji').innerText = emojiMap['None'];
            document.getElementById('user-text').innerText = 'Awaiting Move';

            document.getElementById('ai-emoji').innerText = emojiMap['AI_Ready'];
            document.getElementById('ai-text').innerText = 'AI is ready';

            const resultText = document.getElementById('round-result');
            resultText.innerText = "Let's Play!";
            resultText.className = '';

            document.getElementById('stat-rounds').innerText = '0';
            document.getElementById('stat-draws').innerText = '0';
            document.getElementById('stat-winrate').innerText = '0%';
            document.getElementById('stat-frequent').innerText = '-';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
