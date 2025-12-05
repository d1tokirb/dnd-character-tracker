import React from 'react';
import type { AbilityScores } from '../types';

interface StatsProps {
    abilities: AbilityScores;
    onChange: (ability: keyof AbilityScores, value: number) => void;
}

const ABILITY_NAMES: Record<keyof AbilityScores, string> = {
    str: 'Strength',
    dex: 'Dexterity',
    con: 'Constitution',
    int: 'Intelligence',
    wis: 'Wisdom',
    cha: 'Charisma',
};

export const Stats: React.FC<StatsProps> = ({ abilities, onChange }) => {
    const calculateModifier = (score: number) => {
        const mod = Math.floor((score - 10) / 2);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    return (
        <div className="stats-grid">
            {Object.entries(abilities).map(([key, value]) => {
                const abilityKey = key as keyof AbilityScores;
                return (
                    <div key={key} className="stat-card card">
                        <h3 className="stat-name">{ABILITY_NAMES[abilityKey]}</h3>
                        <div className="stat-value-container">
                            <input
                                type="number"
                                className="stat-input"
                                value={value}
                                onChange={(e) => onChange(abilityKey, parseInt(e.target.value) || 10)}
                            />
                            <div className="stat-modifier">{calculateModifier(value)}</div>
                        </div>
                    </div>
                );
            })}
            <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary));
        }
        .stat-name {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xs);
        }
        .stat-value-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
        }
        .stat-input {
          width: 60px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          background: transparent;
          border: 2px solid var(--border-color);
          color: var(--accent-gold);
        }
        .stat-modifier {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--text-primary);
          background-color: var(--bg-primary);
          padding: 2px 8px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          margin-top: -10px;
          z-index: 1;
        }
      `}</style>
        </div>
    );
};
