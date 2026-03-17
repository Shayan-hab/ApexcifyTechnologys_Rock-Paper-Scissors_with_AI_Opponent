# AI Rock-Paper-Scissors

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Python 3.8+](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Framework-Flask-red.svg)

## 📌 Project Overview
**AI Rock-Paper-Scissors** is a modern, full-stack web application that elevates the classic game by introducing an adaptive Artificial Intelligence opponent. Built with a Python/Flask backend and an interactive JavaScript frontend, the application demonstrates core concepts in state management, asynchronous client-server communication, and probabilistic modeling.

Unlike traditional implementations that rely purely on pseudo-random number generators (PRNG), this application implements a dynamic frequency-analysis learning mechanism. The opponent tracks patterns in the user's move history, updates its predictive model in real-time without requiring persistent database storage, and dynamically alters its strategy to counter the player's most probable next move.

## 🚀 Key Features
*   **Adaptive AI Engine:** Integrates a heuristic algorithm that analyzes the session's move history to predict and counter human non-randomness.
*   **Asynchronous Architecture:** Utilizes the Fetch API for seamless, non-blocking DOM updates (AJAX), ensuring instantaneous gameplay loops without page reloads.
*   **Stateless Persistence:** Employs cryptographically signed session cookies to maintain independent game states, scores, and history for concurrent users securely.
*   **Premium UI/UX:** Designed with a modern, responsive aesthetic featuring CSS grid/flexbox layouts, glassmorphism elements, CSS variables, and fluid micro-animations.

## 🧠 AI Implementation Details
The cognitive model of the AI opponent is designed to exploit the human tendency to fall into predictable patterns when seemingly acting "randomly."

1.  **Exploration Phase:** For the first `n` rounds (default `n=3`), the AI operates in a purely stochastic mode, utilizing `random.choice()` to establish a baseline without biased predictions.
2.  **Tracking & State:** The backend actively serializes every player input into an array within the current Flask session scope.
3.  **Frequency Analysis Matrix:** The AI parses the historical vector to calculate the frequency distribution of the user's moves (`Rock`, `Paper`, `Scissors`).
4.  **Counter-Heuristic Action:** The algorithm identifies the statistical mode (most frequent move) of the user and logically selects the counter-move (e.g., if the user's mode is `Rock`, the AI queues `Paper`).
5.  **Stochastic Variance:** To prevent deterministic exploitation by the user, a 20% randomness threshold is enforced. Roll a float $r \in [0.0, 1.0)$. If $r < 0.2$, the AI bypasses the predictive heuristic and acts randomly.

## 📂 Architecture & Directory Structure
This repository adheres to a lightweight Model-View-Controller (MVC) paradigm:

```text
├── app.py                  # Core Flask server, routing, and AI logic
├── requirements.txt        # Project dependencies
├── .gitignore              # Ignored compilation files and environments
├── templates/              
│   └── index.html          # View layer: Semantic HTML structure and UI
└── static/                 
    ├── style.css           # Styling layer: CSS custom properties and animations
    └── game.js             # Controller layer: Async Fetch methodology and DOM manipulation
```

## 🛠️ Installation & Setup
To run this project locally, ensure you have Python 3.8+ installed on your machine.

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/ai-rock-paper-scissors.git
cd ai-rock-paper-scissors
```

**2. Create a virtual environment:**
```bash
# On Windows:
python -m venv venv
venv\Scripts\activate

# On macOS/Linux:
python3 -m venv venv
source venv/bin/activate
```

**3. Install Dependencies:**
```bash
pip install Flask
# Alternatively, if requirements.txt exists: pip install -r requirements.txt
```

**4. Run the Application:**
```bash
python app.py
```

**5. Visit the App:**
Open your browser and navigate to `http://127.0.0.1:5000/`.

## 📈 Future Enhancements
*   **Markov Chain Implementation:** Upgrade the heuristic model to a 1st or 2nd-order Markov Chain to predict sequential transitions rather than just overall frequency.
*   **Database Integration:** Implement PostgreSQL/SQLAlchemy to persist learning models across long-term sessions or between multiple users.
*   **Multiplayer Sockets:** Integrate `Flask-SocketIO` to allow peer-to-peer gameplay alongside the AI mode.

---
*Architected and engineered for demonstration of full-stack AI concepts.*
