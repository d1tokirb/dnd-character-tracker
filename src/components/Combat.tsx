import React from 'react';

interface CombatProps {
  hp: {
    current: number;
    max: number;
    temp: number;
  };
  ac: number;
  speed: number;
  initiative: number;
  onHpChange: (type: 'current' | 'max' | 'temp', value: number) => void;
  onStatChange: (field: 'ac' | 'speed' | 'initiative', value: number) => void;
}

export const Combat: React.FC<CombatProps> = ({ hp, ac, speed, initiative, onHpChange, onStatChange }) => {
  const hpPercent = Math.min((hp.current / hp.max) * 100, 100);

  const handleStatInput = (value: string): number => {
    if (value === '') return NaN;
    return parseInt(value);
  };

  return (
    <div className="combat-container card">
      <div className="combat-stats-grid">
        <div className="stat-box">
          <span className="stat-label">Armor Class</span>
          <input
            className="stat-input"
            type="number"
            value={isNaN(ac) ? '' : ac}
            onChange={(e) => onStatChange('ac', handleStatInput(e.target.value))}
          />
        </div>
        <div className="stat-box">
          <span className="stat-label">Initiative</span>
          <input
            className="stat-input"
            type="number"
            value={isNaN(initiative) ? '' : initiative}
            onChange={(e) => onStatChange('initiative', handleStatInput(e.target.value))}
          />
        </div>
        <div className="stat-box">
          <span className="stat-label">Speed</span>
          <div className="speed-input-wrapper">
            <input
              className="stat-input"
              type="number"
              value={isNaN(speed) ? '' : speed}
              onChange={(e) => onStatChange('speed', handleStatInput(e.target.value))}
            />
            <span className="unit">ft</span>
          </div>
        </div>
      </div>

      <div className="hp-section">
        <div className="hp-header">
          <h3>Hit Points</h3>
          <div className="hp-values">
            <span className="current-hp">{hp.current}</span>
            <span className="separator">/</span>
            <span className="max-hp">{hp.max}</span>
          </div>
        </div>

        <div className="hp-bar-track">
          <div
            className="hp-bar-fill"
            style={{ width: `${isNaN(hpPercent) ? 0 : hpPercent}%` }}
          />
        </div>

        <div className="hp-inputs-grid">
          <div className="hp-input-group">
            <label>Current</label>
            <input
              type="number"
              value={isNaN(hp.current) ? '' : hp.current}
              onChange={(e) => onHpChange('current', handleStatInput(e.target.value))}
            />
          </div>
          <div className="hp-input-group">
            <label>Max</label>
            <input
              type="number"
              value={isNaN(hp.max) ? '' : hp.max}
              onChange={(e) => onHpChange('max', handleStatInput(e.target.value))}
            />
          </div>
          <div className="hp-input-group">
            <label>Temp</label>
            <input
              type="number"
              value={isNaN(hp.temp) ? '' : hp.temp}
              onChange={(e) => onHpChange('temp', handleStatInput(e.target.value))}
            />
          </div>
        </div>
      </div>

      <style>{`
        .combat-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .combat-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: var(--spacing-sm);
        }
        .stat-box {
          background-color: var(--bg-tertiary);
          padding: var(--spacing-sm);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          border: 1px solid var(--border-color);
        }
        .stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }
        .stat-input {
          width: 100%;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          padding: 0;
          font-family: var(--font-heading);
        }
        .stat-input:focus {
          outline: none;
          border-bottom: 1px solid var(--accent-gold);
        }
        .speed-input-wrapper {
          display: flex;
          align-items: baseline;
          justify-content: center;
        }
        .unit {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-left: 2px;
        }
        .hp-section {
          background-color: var(--bg-tertiary);
          padding: var(--spacing-md);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .hp-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: var(--spacing-xs);
        }
        .hp-header h3 {
          margin: 0;
          font-size: 1rem;
          color: var(--text-secondary);
        }
        .hp-values {
          font-size: 1.2rem;
          font-weight: bold;
        }
        .current-hp { color: var(--accent-red); }
        .max-hp { color: var(--text-secondary); }
        .separator { margin: 0 4px; color: var(--text-secondary); opacity: 0.5; }
        
        .hp-bar-track {
          height: 8px;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: var(--spacing-md);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .hp-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b0000, #ff4444);
          transition: width 0.3s ease;
        }
        .hp-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: var(--spacing-sm);
        }
        .hp-input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .hp-input-group label {
          font-size: 0.7rem;
          color: var(--text-secondary);
          text-align: center;
        }
        .hp-input-group input {
          width: 100%;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 4px;
          text-align: center;
          border-radius: 4px;
          font-weight: bold;
        }
        .hp-input-group input:focus {
          border-color: var(--accent-gold);
          outline: none;
        }
      `}</style>
    </div>
  );
};
