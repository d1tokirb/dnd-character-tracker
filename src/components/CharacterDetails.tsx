import React from 'react';

interface CharacterDetailsProps {
    details: {
        background: string;
        alignment: string;
        xp: number;
        traits: string;
        ideals: string;
        bonds: string;
        flaws: string;
    };
    onChange: (field: string, value: string | number) => void;
}

export const CharacterDetails: React.FC<CharacterDetailsProps> = ({ details, onChange }) => {
    return (
        <div className="details-container card">
            <h3>Character Details</h3>

            <div className="details-grid">
                <div className="detail-field">
                    <label>Background</label>
                    <input
                        type="text"
                        value={details.background}
                        onChange={(e) => onChange('background', e.target.value)}
                    />
                </div>
                <div className="detail-field">
                    <label>Alignment</label>
                    <input
                        type="text"
                        value={details.alignment}
                        onChange={(e) => onChange('alignment', e.target.value)}
                    />
                </div>
                <div className="detail-field">
                    <label>XP</label>
                    <input
                        type="number"
                        value={isNaN(details.xp) ? '' : details.xp}
                        onChange={(e) => onChange('xp', e.target.value === '' ? NaN : parseInt(e.target.value))}
                    />
                </div>
            </div>

            <div className="text-areas">
                <div className="detail-area">
                    <label>Personality Traits</label>
                    <textarea
                        value={details.traits}
                        onChange={(e) => onChange('traits', e.target.value)}
                        rows={3}
                    />
                </div>
                <div className="detail-area">
                    <label>Ideals</label>
                    <textarea
                        value={details.ideals}
                        onChange={(e) => onChange('ideals', e.target.value)}
                        rows={2}
                    />
                </div>
                <div className="detail-area">
                    <label>Bonds</label>
                    <textarea
                        value={details.bonds}
                        onChange={(e) => onChange('bonds', e.target.value)}
                        rows={2}
                    />
                </div>
                <div className="detail-area">
                    <label>Flaws</label>
                    <textarea
                        value={details.flaws}
                        onChange={(e) => onChange('flaws', e.target.value)}
                        rows={2}
                    />
                </div>
            </div>

            <style>{`
        .details-container {
          height: 100%;
        }
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }
        .detail-field {
          display: flex;
          flex-direction: column;
        }
        .text-areas {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .detail-area {
          display: flex;
          flex-direction: column;
        }
        textarea {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: var(--spacing-sm);
          border-radius: 4px;
          font-family: var(--font-body);
          resize: vertical;
        }
        textarea:focus {
          outline: none;
          border-color: var(--accent-gold);
        }
      `}</style>
        </div>
    );
};
