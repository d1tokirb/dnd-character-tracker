import React from 'react';
import type { AbilityScores, Skill } from '../types';

interface SavingThrowsProps {
    saves: Skill[];
    abilities: AbilityScores;
    onToggleProficiency: (saveName: string) => void;
    proficiencyBonus: number;
}

const SAVE_LIST: { name: string; ability: keyof AbilityScores }[] = [
    { name: 'Strength', ability: 'str' },
    { name: 'Dexterity', ability: 'dex' },
    { name: 'Constitution', ability: 'con' },
    { name: 'Intelligence', ability: 'int' },
    { name: 'Wisdom', ability: 'wis' },
    { name: 'Charisma', ability: 'cha' },
];

export const SavingThrows: React.FC<SavingThrowsProps> = ({ saves, abilities, onToggleProficiency, proficiencyBonus }) => {
    const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

    return (
        <div className="saves-card card">
            <h3>Saving Throws</h3>
            <div className="saves-list">
                {SAVE_LIST.map((saveDef) => {
                    const isProficient = saves.some(s => s.name === saveDef.name && s.proficient);
                    const abilityScore = abilities[saveDef.ability];
                    const modifier = calculateModifier(abilityScore);
                    const totalBonus = modifier + (isProficient ? proficiencyBonus : 0);

                    return (
                        <div key={saveDef.name} className="save-row">
                            <div
                                className={`proficiency-marker ${isProficient ? 'active' : ''}`}
                                onClick={() => onToggleProficiency(saveDef.name)}
                            />
                            <span className="save-bonus">{totalBonus >= 0 ? `+${totalBonus}` : totalBonus}</span>
                            <span className="save-name">{saveDef.name}</span>
                        </div>
                    );
                })}
            </div>
            <style>{`
        .saves-card {
          margin-bottom: var(--spacing-md);
        }
        .saves-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-xs) var(--spacing-md);
        }
        .save-row {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: 2px 0;
        }
        .proficiency-marker {
          width: 10px;
          height: 10px;
          border: 1px solid var(--text-secondary);
          border-radius: 50%;
          cursor: pointer;
        }
        .proficiency-marker.active {
          background-color: var(--accent-gold);
          border-color: var(--accent-gold);
          box-shadow: 0 0 4px var(--accent-gold);
        }
        .save-bonus {
          min-width: 20px;
          text-align: right;
          font-weight: bold;
          color: var(--text-primary);
          font-size: 0.9rem;
        }
        .save-name {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }
      `}</style>
        </div>
    );
};
