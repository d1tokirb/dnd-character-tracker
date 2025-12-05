import React from 'react';

interface XPBarProps {
  currentXP: number;
  level: number;
}

// 5e XP Table
const XP_TABLE: { [level: number]: number } = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000,
};

export const XPBar: React.FC<XPBarProps> = ({ currentXP, level }) => {
  const currentLevelXP = XP_TABLE[level] || 0;
  const nextLevelXP = XP_TABLE[level + 1] || currentLevelXP; // Cap at max level

  // Calculate progress within the current level
  // For level 1 (0 XP) to 2 (300 XP), progress is currentXP / 300.
  // For level 2 (300 XP) to 3 (900 XP), progress is (currentXP - 300) / (900 - 300).

  let progress = 0;
  if (level < 20) {
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    const xpGainedInLevel = currentXP - currentLevelXP;
    progress = Math.min(Math.max((xpGainedInLevel / xpNeededForLevel) * 100, 0), 100);
  } else {
    progress = 100;
  }

  return (
    <div className="xp-bar-container">
      <div className="xp-info">
        <span className="level-badge">Lvl {level}</span>
        <span className="xp-text">{currentXP} / {nextLevelXP} XP</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <style>{`
        .xp-bar-container {
          background-color: var(--bg-secondary);
          padding: 4px var(--spacing-md);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .xp-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .level-badge {
          color: var(--accent-gold);
          font-weight: bold;
        }
        .progress-track {
          height: 6px;
          background-color: var(--bg-tertiary);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-blue), var(--accent-gold));
          transition: width 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
