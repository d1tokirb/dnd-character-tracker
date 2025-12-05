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
          max-width: 800px;
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
        .char-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: var(--spacing-lg);
        }
        .char-card {
          min-height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s, border-color 0.2s;
          position: relative;
        }
        .char-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-gold);
        }
        .char-info {
          cursor: pointer;
          flex: 1;
        }
        .char-info h2 {
          font-size: 1.2rem;
          margin-bottom: var(--spacing-xs);
          color: var(--text-primary);
        }
        .char-details {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .delete-btn {
          align-self: flex-end;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.8rem;
          padding: 4px 8px;
          opacity: 0;
          transition: opacity 0.2s, color 0.2s;
        }
        .char-card:hover .delete-btn {
          opacity: 1;
        }
        .delete-btn:hover {
          color: var(--accent-red);
        }
        .add-btn {
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          background: rgba(255, 255, 255, 0.02);
          border-style: dashed;
          cursor: pointer;
        }
        .add-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }
        .plus-icon {
          font-size: 2rem;
          font-weight: bold;
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
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          padding: 8px;
          color: var(--text-primary);
          text-align: center;
        }
        .create-actions {
          display: flex;
          gap: var(--spacing-sm);
          justify-content: center;
        }
        .confirm-btn {
          background: var(--accent-gold);
          color: var(--bg-primary);
          border: none;
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: bold;
        }
        .cancel-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 4px 12px;
          border-radius: 4px;
        }
      `}</style>
        </div>
    );
};
