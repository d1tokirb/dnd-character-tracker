import React, { useState } from 'react';

export const DiceRoller: React.FC = () => {
    const [history, setHistory] = useState<{ dice: string; result: number; timestamp: number }[]>([]);

    const rollDice = (sides: number) => {
        const result = Math.floor(Math.random() * sides) + 1;
        setHistory(prev => [{ dice: `d${sides}`, result, timestamp: Date.now() }, ...prev].slice(0, 10));
    };

    const diceTypes = [4, 6, 8, 10, 12, 20];

    return (
        <div className="dice-roller card">
            <h3>Dice Roller</h3>
            <div className="dice-buttons">
                {diceTypes.map(sides => (
                    <button
                        key={sides}
                        className={`d${sides}-btn`}
                        onClick={() => rollDice(sides)}
                    >
                        d{sides}
                    </button>
                ))}
            </div>
            <div className="roll-history">
                <h4>Recent Rolls</h4>
                <ul>
                    {history.map((roll) => (
                        <li key={roll.timestamp} className="roll-entry">
                            <span className="roll-dice">{roll.dice}</span>
                            <span className="roll-result">{roll.result}</span>
                        </li>
                    ))}
                    {history.length === 0 && <li className="empty-history">No rolls yet</li>}
                </ul>
            </div>

            <style>{`
        .dice-roller {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .dice-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-sm);
        }
        .dice-buttons button {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
          padding: var(--spacing-sm);
          border-radius: 4px;
          font-weight: bold;
          transition: all 0.2s;
        }
        .dice-buttons button:hover {
          background-color: var(--accent-gold);
          color: var(--bg-primary);
          transform: scale(1.05);
        }
        .d20-btn {
          grid-column: 1 / -1;
          background-color: rgba(212, 175, 55, 0.1) !important;
          font-size: 1.2rem;
        }
        .roll-history {
          border-top: 1px solid var(--border-color);
          padding-top: var(--spacing-sm);
        }
        .roll-history h4 {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xs);
        }
        .roll-history ul {
          list-style: none;
          max-height: 150px;
          overflow-y: auto;
        }
        .roll-entry {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .roll-dice {
          color: var(--text-secondary);
        }
        .roll-result {
          font-weight: bold;
          color: var(--accent-gold);
        }
        .empty-history {
          color: var(--text-secondary);
          font-style: italic;
          font-size: 0.8rem;
          text-align: center;
        }
      `}</style>
        </div>
    );
};
