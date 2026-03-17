from flask import Flask, render_template, request, jsonify, session
import random

app = Flask(__name__)
# In production, use a secure random key
app.secret_key = 'super_secret_rock_paper_scissors_key'

MOVES = ['Rock', 'Paper', 'Scissors']
WIN_MAP = {
    'Rock': 'Scissors',
    'Paper': 'Rock',
    'Scissors': 'Paper'
}

def determine_winner(user_move, ai_move):
    if user_move == ai_move:
        return 'Draw'
    elif WIN_MAP[user_move] == ai_move:
        return 'Win'
    else:
        return 'Lose'

def get_ai_move(user_history):
    """
    AI Logic: Predict next move based on frequency
    """
    if len(user_history) < 3:
        # Not enough history, play randomly
        return random.choice(MOVES)
    
    # Count frequencies of user moves
    frequencies = {'Rock': 0, 'Paper': 0, 'Scissors': 0}
    for move in user_history:
        if move in frequencies:
            frequencies[move] += 1
            
    # Find the most frequent move by the user
    most_frequent_user_move = max(frequencies, key=frequencies.get)
    
    # Counter the most frequent move
    # To counter 'Rock', play 'Paper'. To counter 'Paper', play 'Scissors'. 
    # To counter 'Scissors', play 'Rock'.
    counter_move_map = {
        'Rock': 'Paper',
        'Paper': 'Scissors',
        'Scissors': 'Rock'
    }
    
    # Add a small degree of randomness (20%) to prevent the AI from being 100% predictable
    if random.random() < 0.2: 
        return random.choice(MOVES)
        
    return counter_move_map[most_frequent_user_move]

@app.route('/')
def index():
    # Initialize session specific variables if they don't exist
    if 'history' not in session:
        session['history'] = []
    if 'wins' not in session:
        session['wins'] = 0
    if 'losses' not in session:
        session['losses'] = 0
    if 'draws' not in session:
        session['draws'] = 0
    if 'total_rounds' not in session:
        session['total_rounds'] = 0
        
    return render_template('index.html')

@app.route('/play', methods=['POST'])
def play():
    data = request.get_json()
    user_move = data.get('move')
    
    if user_move not in MOVES:
        return jsonify({'error': 'Invalid move'}), 400
        
    # Get history safely
    history = session.get('history', [])
    
    # Determine AI move
    ai_move = get_ai_move(history)
    
    # Determine Winner
    result = determine_winner(user_move, ai_move)
    
    # Update state
    history.append(user_move)
    session['history'] = history
    session['total_rounds'] = session.get('total_rounds', 0) + 1
    
    if result == 'Win':
        session['wins'] = session.get('wins', 0) + 1
    elif result == 'Lose':
        session['losses'] = session.get('losses', 0) + 1
    else:
        session['draws'] = session.get('draws', 0) + 1
        
    # Calculate stats
    total_rounds = session['total_rounds']
    wins = session['wins']
    win_rate = round((wins / total_rounds) * 100, 1) if total_rounds > 0 else 0
    
    # Find most frequent move string
    most_frequent = "None"
    if len(history) > 0:
        frequencies = {'Rock': 0, 'Paper': 0, 'Scissors': 0}
        for m in history:
            if m in frequencies:
                frequencies[m] += 1
        most_frequent = max(frequencies, key=frequencies.get)

    return jsonify({
        'user_move': user_move,
        'ai_move': ai_move,
        'result': result,
        'stats': {
            'wins': session['wins'],
            'losses': session['losses'],
            'draws': session['draws'],
            'total_rounds': total_rounds,
            'win_rate': f"{win_rate}%",
            'most_frequent': most_frequent
        }
    })

@app.route('/reset', methods=['POST'])
def reset():
    """Clear session data to restart the game."""
    session.clear()
    return jsonify({'message': 'Game reset successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
