import React, { useState } from 'react';


interface CharacterSelectionProps {
  characters: { id: string; name: string; level: number; class: string; race: string }[];
  onCreateCharacter: (name: string) => void;
  onSelectCharacter: (id: string) => void;
  onDeleteCharacter: (id: string) => void;
  onSignOut: () => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  characters,
  onCreateCharacter,
  onSelectCharacter,
  onDeleteCharacter,
  onSignOut
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newCharName, setNewCharName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCharName.trim()) {
      onCreateCharacter(newCharName.trim());
      setNewCharName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="char-selection-container">
      <div className="char-selection-header">
        <h1>Your Characters</h1>
        <button className="sign-out-btn" onClick={onSignOut}>Sign Out</button>
      </div>

      <div className="char-grid">
        {characters.map((char) => (
          <div key={char.id} className="char-card card">
            <div className="char-info" onClick={() => onSelectCharacter(char.id)}>
              <h2>{char.name}</h2>
              <p className="char-details">Level {char.level} {char.race} {char.class}</p>
            </div>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete ${char.name}?`)) {
                  onDeleteCharacter(char.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        ))}

        {isCreating ? (
          <div className="char-card card create-card">
            <form onSubmit={handleCreate}>
              <input
                autoFocus
                type="text"
                placeholder="Character Name"
                value={newCharName}
                onChange={(e) => setNewCharName(e.target.value)}
                className="new-char-input"
              />
              <div className="create-actions">
                <button type="submit" className="confirm-btn">Create</button>
                <button type="button" className="cancel-btn" onClick={() => setIsCreating(false)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <button className="char-card card add-btn" onClick={() => setIsCreating(true)}>
            <span className="plus-icon">+</span>
            <span>New Character</span>
          </button>
        )}
      </div>

      <style>{`
        .char-selection-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: var(--spacing-xl);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .char-selection-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: var(--spacing-md);
        }
        .char-selection-header h1 {
          font-size: 2rem;
          color: var(--accent-gold);
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .sign-out-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 8px 16px;
          border-radius: 4px;
          transition: all 0.2s;
          font-family: var(--font-body);
        }
        .sign-out-btn:hover {
          border-color: var(--accent-red);
          color: var(--accent-red);
          background: rgba(139, 0, 0, 0.1);
        }
        .char-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }
        .char-card {
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease;
          position: relative;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          cursor: pointer;
        }
        .char-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
        }
        .char-info {
          flex: 1;
          padding: var(--spacing-sm);
        }
        .char-info h2 {
          font-size: 1.4rem;
          margin-bottom: var(--spacing-xs);
          color: var(--text-primary);
        }
        .char-details {
          color: var(--text-secondary);
          font-size: 1rem;
          opacity: 0.8;
        }
        .delete-btn {
          align-self: flex-end;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          font-size: 0.8rem;
          padding: 6px 12px;
          border-radius: 4px;
          opacity: 0;
          transition: all 0.2s;
          margin-top: var(--spacing-sm);
        }
        .char-card:hover .delete-btn {
          opacity: 1;
        }
        .delete-btn:hover {
          color: var(--accent-red);
          border-color: var(--accent-red);
          background: rgba(139, 0, 0, 0.1);
        }
        .add-btn {
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed var(--border-color);
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.2s;
        }
        .add-btn:hover {
          background: rgba(212, 175, 55, 0.05);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }
        .plus-icon {
          font-size: 2.5rem;
          font-weight: 300;
          color: inherit;
          transition: color 0.2s;
        }
        .create-card form {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;
          gap: var(--spacing-md);
        }
        .new-char-input {
          width: 100%;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 12px;
          color: var(--text-primary);
          text-align: center;
          font-size: 1.1rem;
          border-radius: 4px;
        }
        .new-char-input:focus {
          border-color: var(--accent-gold);
          outline: none;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }
        .create-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
        }
        .confirm-btn {
          background: var(--accent-gold);
          color: var(--bg-primary);
          border: none;
          padding: 8px 20px;
          border-radius: 4px;
          font-weight: bold;
          font-family: var(--font-heading);
          transition: transform 0.1s;
        }
        .confirm-btn:hover {
          background: var(--accent-gold-dim);
          color: white;
        }
        .cancel-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 8px 20px;
          border-radius: 4px;
          font-family: var(--font-heading);
          transition: all 0.2s;
        }
        .cancel-btn:hover {
          border-color: var(--text-primary);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};
