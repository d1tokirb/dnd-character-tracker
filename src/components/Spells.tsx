import React, { useState } from 'react';

interface SpellsProps {
  slots: { [level: number]: { total: number; used: number } };
  list: { name: string; level: number; prepared: boolean; description: string }[];
  onSlotChange: (level: number, type: 'total' | 'used', value: number) => void;
  onAddSpell: (name: string, level: number, description: string) => void;
  onTogglePrepared: (name: string) => void;
  onRemoveSpell: (name: string) => void;
}

export const Spells: React.FC<SpellsProps> = ({
  slots,
  list,
  onSlotChange,
  onAddSpell,
  onTogglePrepared,
  onRemoveSpell
}) => {
  const [newSpellName, setNewSpellName] = useState('');
  const [newSpellLevel, setNewSpellLevel] = useState(0);
  const [newSpellDesc, setNewSpellDesc] = useState('');
  const [expandedSpell, setExpandedSpell] = useState<string | null>(null);

  const handleAdd = () => {
    if (newSpellName.trim()) {
      onAddSpell(newSpellName.trim(), newSpellLevel, newSpellDesc.trim());
      setNewSpellName('');
      setNewSpellDesc('');
    }
  };

  const toggleExpand = (name: string) => {
    setExpandedSpell(expandedSpell === name ? null : name);
  };

  const spellLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="spells-container card">
      <h3>Spells & Magic</h3>

      <div className="add-spell-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Spell Name"
            value={newSpellName}
            onChange={(e) => setNewSpellName(e.target.value)}
            className="name-input"
          />
          <select
            value={newSpellLevel}
            onChange={(e) => setNewSpellLevel(parseInt(e.target.value))}
            className="level-select"
          >
            {spellLevels.map(lvl => (
              <option key={lvl} value={lvl}>{lvl === 0 ? 'Cantrip' : `Lvl ${lvl}`}</option>
            ))}
          </select>
          <button onClick={handleAdd}>Add</button>
        </div>
        <textarea
          placeholder="Spell Description (optional)"
          value={newSpellDesc}
          onChange={(e) => setNewSpellDesc(e.target.value)}
          className="desc-input"
          rows={2}
        />
      </div>

      <div className="spells-list">
        {spellLevels.map(level => {
          const spellsAtLevel = list.filter(s => s.level === level);
          const slotInfo = slots[level];

          if (level > 0 && !slotInfo && spellsAtLevel.length === 0) return null;

          return (
            <div key={level} className="spell-level-group">
              <div className="level-header">
                <h4>{level === 0 ? 'Cantrips' : `Level ${level}`}</h4>
                {level > 0 && (
                  <div className="slots-tracker">
                    <label>Slots:</label>
                    <div className="slot-inputs">
                      <input
                        type="number"
                        min="0"
                        value={isNaN(slotInfo?.used) ? '' : slotInfo?.used ?? 0}
                        onChange={(e) => onSlotChange(level, 'used', e.target.value === '' ? NaN : parseInt(e.target.value))}
                      />
                      <span>/</span>
                      <input
                        type="number"
                        min="0"
                        value={isNaN(slotInfo?.total) ? '' : slotInfo?.total ?? 0}
                        onChange={(e) => onSlotChange(level, 'total', e.target.value === '' ? NaN : parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>

              <ul className="spells-at-level">
                {spellsAtLevel.map(spell => (
                  <li key={spell.name} className="spell-item-container">
                    <div className="spell-item">
                      <div className="spell-info">
                        <input
                          type="checkbox"
                          checked={spell.prepared}
                          onChange={() => onTogglePrepared(spell.name)}
                          title="Prepared?"
                        />
                        <span
                          className={`spell-name ${spell.prepared ? 'prepared' : ''}`}
                          onClick={() => toggleExpand(spell.name)}
                        >
                          {spell.name}
                        </span>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => onRemoveSpell(spell.name)}
                      >
                        ×
                      </button>
                    </div>
                    {expandedSpell === spell.name && spell.description && (
                      <div className="spell-description">
                        {spell.description}
                      </div>
                    )}
                  </li>
                ))}
                {spellsAtLevel.length === 0 && <li className="empty-msg">No spells known</li>}
              </ul>
            </div>
          );
        })}
      </div>

      <style>{`
        .spells-container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .add-spell-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-md);
          background: var(--bg-tertiary);
          padding: var(--spacing-sm);
          border-radius: 4px;
        }
        .form-row {
          display: flex;
          gap: var(--spacing-sm);
        }
        .name-input {
          flex: 2;
        }
        .level-select {
          flex: 1;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: 4px;
        }
        .desc-input {
          width: 100%;
          resize: vertical;
          font-size: 0.9rem;
        }
        .add-spell-form button {
          background-color: var(--accent-gold);
          color: var(--bg-primary);
          border: none;
          padding: 0 var(--spacing-md);
          border-radius: 4px;
          font-weight: bold;
        }
        .spells-list {
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .level-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 4px;
          margin-bottom: 8px;
        }
        .level-header h4 {
          margin: 0;
          color: var(--accent-blue);
          font-size: 0.9rem;
        }
        .slots-tracker {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .slot-inputs {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .slot-inputs input {
          width: 30px;
          padding: 2px;
          text-align: center;
          font-size: 0.8rem;
        }
        .spells-at-level {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4px;
          list-style: none;
          padding: 0;
        }
        .spell-item-container {
          display: flex;
          flex-direction: column;
          background-color: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid var(--border-color);
          border-radius: 0;
          padding: 4px 0; /* Removed horizontal padding */
        }
        .spell-item-container:first-child {
          border-top: 1px solid var(--border-color);
        }
        .spell-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0 8px; /* Add padding to item instead to keep delete btn from edge */
        }
        .spell-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex: 1;
          min-width: 0;
          justify-content: flex-start; /* Explicitly align left */
        }
        .spell-info input[type="checkbox"] {
          accent-color: var(--accent-gold);
          flex-shrink: 0;
          margin: 0; /* Remove default margins */
        }
        .spell-name {
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left; /* Force left align */
        }
        .spell-name:hover {
          color: var(--accent-gold);
        }
        .spell-info span.prepared {
          color: var(--accent-gold);
          text-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
        }
        .spell-description {
          margin-top: var(--spacing-xs);
          padding-top: var(--spacing-xs);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-style: italic;
          line-height: 1.4;
        }
        .empty-msg {
          grid-column: 1 / -1;
          color: var(--text-secondary);
          font-style: italic;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};
