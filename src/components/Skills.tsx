import React from 'react';
import type { AbilityScores, Skill } from '../types';

interface SkillsProps {
    skills: Skill[];
    abilities: AbilityScores;
    onToggleProficiency: (skillName: string) => void;
    proficiencyBonus: number;
}

const SKILL_LIST: { name: string; ability: keyof AbilityScores }[] = [
    { name: 'Acrobatics', ability: 'dex' },
    { name: 'Animal Handling', ability: 'wis' },
    { name: 'Arcana', ability: 'int' },
    { name: 'Athletics', ability: 'str' },
    { name: 'Deception', ability: 'cha' },
    { name: 'History', ability: 'int' },
    { name: 'Insight', ability: 'wis' },
    { name: 'Intimidation', ability: 'cha' },
    { name: 'Investigation', ability: 'int' },
    { name: 'Medicine', ability: 'wis' },
    { name: 'Nature', ability: 'int' },
    { name: 'Perception', ability: 'wis' },
    { name: 'Performance', ability: 'cha' },
    { name: 'Persuasion', ability: 'cha' },
    { name: 'Religion', ability: 'int' },
    { name: 'Sleight of Hand', ability: 'dex' },
    { name: 'Stealth', ability: 'dex' },
    { name: 'Survival', ability: 'wis' },
];

export const Skills: React.FC<SkillsProps> = ({ skills, abilities, onToggleProficiency, proficiencyBonus }) => {
    const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

    return (
        <div className="skills-card card">
            <h3>Skills</h3>
            <div className="skills-list">
                {SKILL_LIST.map((skillDef) => {
                    const isProficient = skills.some(s => s.name === skillDef.name && s.proficient);
                    const abilityScore = abilities[skillDef.ability];
                    const modifier = calculateModifier(abilityScore);
                    const totalBonus = modifier + (isProficient ? proficiencyBonus : 0);

                    return (
                        <div key={skillDef.name} className="skill-row">
                            <div
                                className={`proficiency-marker ${isProficient ? 'active' : ''}`}
                                onClick={() => onToggleProficiency(skillDef.name)}
                            />
                            <span className="skill-bonus">{totalBonus >= 0 ? `+${totalBonus}` : totalBonus}</span>
                            <span className="skill-name">{skillDef.name} <span className="skill-ability">({skillDef.ability.substring(0, 3).toUpperCase()})</span></span>
                        </div>
                    );
                })}
            </div>
            <style>{`
        .skills-card {
          height: 100%;
        }
        .skills-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .skill-row {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: 4px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .proficiency-marker {
          width: 12px;
          height: 12px;
          border: 1px solid var(--text-secondary);
          border-radius: 50%;
          cursor: pointer;
        }
        .proficiency-marker.active {
          background-color: var(--accent-gold);
          border-color: var(--accent-gold);
          box-shadow: 0 0 4px var(--accent-gold);
        }
        .skill-bonus {
          min-width: 24px;
          text-align: right;
          font-weight: bold;
          color: var(--text-primary);
        }
        .skill-name {
          color: var(--text-primary);
        }
        .skill-ability {
          color: var(--text-secondary);
          font-size: 0.8em;
        }
      `}</style>
        </div>
    );
};
